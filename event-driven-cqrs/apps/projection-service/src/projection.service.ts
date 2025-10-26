import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '@app/common/entities/wallet.entity';
import { EventType } from '@app/common/enums/event-type.enum';
import { Event } from '@app/common/entities/event.entity';
import { getShardName } from '@app/common/utils/shard.util';

@Injectable()
export class ProjectionService {
  private readonly logger = new Logger(ProjectionService.name);

  constructor(
    @InjectRepository(Wallet, 'shard-1')
    private readonly walletRepoShard1: Repository<Wallet>,
    @InjectRepository(Wallet, 'shard-2')
    private readonly walletRepoShard2: Repository<Wallet>,
  ) {}

  private getRepo(accountId: string): Repository<Wallet> {
    const shard = getShardName(accountId);
    return shard === 'shard-1' ? this.walletRepoShard1 : this.walletRepoShard2;
  }

  async handleEvent(event: Event) {
    const { type, payload } = event;
    this.logger.log(`Processing event: ${type}`);

    switch (type) {
      case EventType.WalletCreated:
        await this.handleWalletCreated(payload);
        break;
      case EventType.WalletUpdated:
        await this.handleWalletUpdated(payload);
        break;
      case EventType.WalletDeleted:
        await this.handleWalletDeleted(payload);
        break;
      case EventType.BalanceDebited:
        await this.handleBalanceDebited(payload);
        break;
      case EventType.BalanceCredited:
        await this.handleBalanceCredited(payload);
        break;
      default:
        this.logger.warn(`Unhandled event type: ${type}`);
    }
  }

  private async handleWalletCreated(payload: any) {
    const repo = this.getRepo(payload.accountId);
    await repo.insert({
      accountId: payload.accountId,
      currency: payload.currency,
      balance: payload.balance ?? 0,
    });
  }

  private async handleWalletUpdated(payload: any) {
    const repo = this.getRepo(payload.accountId);
    await repo.update({ accountId: payload.accountId }, payload);
  }

  private async handleWalletDeleted(payload: any) {
    const repo = this.getRepo(payload.accountId);
    await repo.delete({ accountId: payload.accountId });
  }

  private async handleBalanceDebited(payload: any) {
    const repo = this.getRepo(payload.accountId);
    const wallet = await repo.findOneBy({ accountId: payload.accountId });
    if (!wallet) return;
    wallet.balance = wallet.balance - payload.amount;
    await repo.save(wallet);
  }

  private async handleBalanceCredited(payload: any) {
    const repo = this.getRepo(payload.accountId);
    const wallet = await repo.findOneBy({ accountId: payload.accountId });
    if (!wallet) return;
    wallet.balance = wallet.balance + payload.amount;
    await repo.save(wallet);
  }
}
