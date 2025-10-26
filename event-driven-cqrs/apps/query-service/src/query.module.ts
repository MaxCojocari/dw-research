import { Module } from '@nestjs/common';
import { QueryController } from './query.controller';
import { QueryService } from './query.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule, RedisSingleOptions } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'shard-1',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.shard_1.host'),
        port: configService.get('database.shard_1.port'),
        username: configService.get('database.shard_1.user'),
        password: configService.get('database.shard_1.password'),
        database: configService.get('database.shard_1.db'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: 'shard-2',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.shard_2.host'),
        port: configService.get('database.shard_2.port'),
        username: configService.get('database.shard_2.user'),
        password: configService.get('database.shard_2.password'),
        database: configService.get('database.shard_2.db'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const host = config.get('redis.host');
        const port = config.get('redis.port');
        const res: RedisSingleOptions = {
          type: 'single',
          url: `redis://${host}:${port}`,
        };
        return res;
      },
    }),
  ],
  controllers: [QueryController],
  providers: [QueryService],
})
export class QueryModule {}
