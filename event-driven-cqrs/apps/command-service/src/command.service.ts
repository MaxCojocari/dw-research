import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Wallet } from '../../../libs/common/src/schemas/wallet.entity';
import { Event } from '../../../libs/common/src/schemas/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransferBalanceDto } from '../../../libs/common/src/dto/transfer-balance.dto';
import { v4 as uuidv4 } from 'uuid';
import { getShardName } from '../../../libs/common/src/utils/shard.util';
import { CreateWalletDto } from '../../../libs/common/src/dto/create-wallet.dto';
import { UpdateWalletDto } from '../../../libs/common/src/dto/update-wallet.dto';

@Injectable()
export class CommandService {
  private readonly CACHE_TTL = 60; // seconds

  constructor(
    @InjectRepository(Wallet, 'shard-1')
    private readonly walletRepoShard1: Repository<Wallet>,
    @InjectRepository(Wallet, 'shard-2')
    private readonly walletRepoShard2: Repository<Wallet>,
    @InjectRepository(Event, 'event-store')
    private readonly eventRepo: Repository<Event>,
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

    // Build 2 events and send them to Kafka, persist them in Event Store
  }

  async createWallet(dto: CreateWalletDto & { accountId: string }) {
    const repo = this.getRepo(dto.accountId);
    const existing = await repo.findOne({
      where: { accountId: dto.accountId },
    });
    if (existing) throw new BadRequestException('Wallet already exists');

    // Build CreateWallet event and send to Kafka
  }

  async updateWallet(dto: UpdateWalletDto & { accountId: string }) {
    const repo = this.getRepo(dto.accountId);
    const wallet = await repo.findOne({ where: { accountId: dto.accountId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    // Build UpdateWallet event and send to Kafka
  }

  async deleteWallet(dto: { accountId: string }) {
    const { accountId } = dto;
    const repo = this.getRepo(accountId);
    const wallet = await repo.findOne({ where: { accountId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    // Build DeleteWallet event and send to Kafka
  }
}
