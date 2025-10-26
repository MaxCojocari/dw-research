import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Wallet } from '@app/common/entities/wallet.entity';
import { Event } from '@app/common/entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransferBalanceDto } from '@app/common/dto/transfer-balance.dto';
import { v4 as uuidv4 } from 'uuid';
import { getShardName } from '@app/common/utils/shard.util';
import { CreateWalletDto } from '@app/common/dto/create-wallet.dto';
import { UpdateWalletDto } from '@app/common/dto/update-wallet.dto';
import { PROJECTION_SERVICE } from '@app/common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { EventType } from '@app/common/enums/event-type.enum';

@Injectable()
export class CommandService {
  constructor(
    @InjectRepository(Wallet, 'shard-1')
    private readonly walletRepoShard1: Repository<Wallet>,
    @InjectRepository(Wallet, 'shard-2')
    private readonly walletRepoShard2: Repository<Wallet>,
    @InjectRepository(Event, 'event-store')
    private readonly eventRepo: Repository<Event>,
    @Inject(PROJECTION_SERVICE)
    private readonly projectionService: ClientProxy,
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

    if (!fromWallet || fromWallet.balance < amount)
      throw new BadRequestException('Insufficient balance');
    if (!toWallet) throw new BadRequestException('Target wallet not found');

    // Create and persist events
    const debitEvent = this.eventRepo.create({
      type: EventType.BalanceDebited,
      payload: { accountId: fromAccount, amount, currency, transactionId },
    });
    const creditEvent = this.eventRepo.create({
      type: EventType.BalanceCredited,
      payload: { accountId: toAccount, amount, currency, transactionId },
    });
    await this.eventRepo.save([debitEvent, creditEvent]);

    // Emit to Projection Service
    this.projectionService.emit('wallet', debitEvent);
    this.projectionService.emit('wallet', creditEvent);
  }

  async createWallet(dto: CreateWalletDto & { accountId: string }) {
    const repo = this.getRepo(dto.accountId);
    const existing = await repo.findOne({
      where: { accountId: dto.accountId },
    });
    if (existing) throw new BadRequestException('Wallet already exists');

    const event = this.eventRepo.create({
      type: EventType.WalletCreated,
      payload: dto,
    });
    await this.eventRepo.save(event);
    this.projectionService.emit('wallet', event);
  }

  async updateWallet(dto: UpdateWalletDto & { accountId: string }) {
    const repo = this.getRepo(dto.accountId);
    const wallet = await repo.findOne({ where: { accountId: dto.accountId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const event = this.eventRepo.create({
      type: EventType.WalletUpdated,
      payload: dto,
    });
    await this.eventRepo.save(event);
    this.projectionService.emit('wallet', event);
  }

  async deleteWallet(dto: { accountId: string }) {
    const repo = this.getRepo(dto.accountId);
    const wallet = await repo.findOne({ where: { accountId: dto.accountId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const event = this.eventRepo.create({
      type: EventType.WalletDeleted,
      payload: dto,
    });
    await this.eventRepo.save(event);
    this.projectionService.emit('wallet', event);
  }
}
