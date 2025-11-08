import { BadRequestException, Injectable } from '@nestjs/common';
import { GetBalanceDto } from '../../../libs/common/src/dto/get-balance.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { Wallet } from '@app/common/entities/wallet.entity';
import { getShardName } from '@app/common/utils/shard.util';

@Injectable()
export class QueryService {
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

  async getBalance(dto: GetBalanceDto) {
    console.log('query-service getBalance');
    const { accountId } = dto;
    const cached = await this.redisClient.get(accountId);
    if (cached) return JSON.parse(cached);

    const repo = this.getRepo(accountId);
    const wallet = await repo.findOne({
      where: dto,
    });

    console.log('query-service found wallet:', wallet);

    if (!wallet) throw new BadRequestException('Wallet not found');

    await this.redisClient.setex(
      accountId,
      this.CACHE_TTL,
      JSON.stringify(wallet),
    );

    return wallet;
  }
}
