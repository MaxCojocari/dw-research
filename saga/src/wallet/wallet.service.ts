import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getShardName } from '../common/shard.util';
import { Wallet } from './entities/wallet.entity';
import { v4 as uuidv4 } from 'uuid';
import { TransferBalanceDto } from './dto/transfer-balance.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Injectable()
export class WalletService {
  private readonly CACHE_TTL = 60; // seconds

  constructor(
    @InjectRepository(Wallet, 'shard-1')
    private readonly walletRepoShard1: Repository<Wallet>,
    @InjectRepository(Wallet, 'shard-2')
    private readonly walletRepoShard2: Repository<Wallet>,
    @InjectRedis()
    private readonly redisClient: Redis,
  ) {}

  private getRepo(accountId: string): Repository<Wallet> {
    const shard = getShardName(accountId);
    return shard === 'shard-1' ? this.walletRepoShard1 : this.walletRepoShard2;
  }

  async transferBalance(dto: TransferBalanceDto) {
    const { fromAccount, toAccount, amount, currency } = dto;
    if (amount <= 0) throw new BadRequestException('Invalid amount');

    const transactionId = uuidv4();

    const fromRepo = this.getRepo(fromAccount);
    const toRepo = this.getRepo(toAccount);

    const fromWallet = await fromRepo.findOne({
      where: { accountId: fromAccount, currency },
    });
    const toWallet = await toRepo.findOne({
      where: { accountId: toAccount, currency },
    });

    if (!fromWallet || fromWallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    if (!toWallet) throw new BadRequestException('Target wallet not found');

    try {
      // SAGA: Step 1 - debit source
      fromWallet.balance = fromWallet.balance - amount;
      await fromRepo.save(fromWallet);

      // SAGA: Step 2 - credit destination
      toWallet.balance = toWallet.balance + amount;
      await toRepo.save(toWallet);

      // Update cache
      await this.redisClient.setex(
        fromAccount,
        this.CACHE_TTL,
        JSON.stringify(fromWallet),
      );
      await this.redisClient.setex(
        toAccount,
        this.CACHE_TTL,
        JSON.stringify(toWallet),
      );

      return { status: 'success', transactionId };
    } catch (error) {
      // Compensation: rollback debit
      fromWallet.balance = fromWallet.balance + amount;
      await fromRepo.save(fromWallet);
      throw new BadRequestException('Transfer failed, transaction rolled back');
    }
  }

  async getBalance(accountId: string, currency: string | undefined) {
    const cached = await this.redisClient.get(accountId);
    if (cached) return JSON.parse(cached);

    const repo = this.getRepo(accountId);
    const wallet = await repo.findOne({
      where: { accountId, currency: currency || 'USD' },
    });

    if (!wallet) throw new BadRequestException('Wallet not found');

    await this.redisClient.setex(
      accountId,
      this.CACHE_TTL,
      JSON.stringify(wallet),
    );
    return wallet;
  }

  async createWallet(dto: CreateWalletDto) {
    const repo = this.getRepo(dto.accountId);
    const existing = await repo.findOne({
      where: { accountId: dto.accountId },
    });
    if (existing) throw new BadRequestException('Wallet already exists');

    const wallet = repo.create({
      accountId: dto.accountId,
      currency: dto.currency,
      balance: dto.balance ?? 0,
    });
    return repo.save(wallet);
  }

  async updateWallet(accountId: string, dto: UpdateWalletDto) {
    const repo = this.getRepo(accountId);
    const wallet = await repo.findOne({ where: { accountId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    Object.assign(wallet, dto);
    return repo.save(wallet);
  }

  async deleteWallet(accountId: string) {
    const repo = this.getRepo(accountId);
    const result = await repo.delete({ accountId });

    if (result.affected === 0) throw new NotFoundException('Wallet not found');
    return { status: 'deleted', accountId };
  }
}
