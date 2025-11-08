import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { configurationSchema } from './config/configuration.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule } from './wallet/wallet.module';
import { RedisModule, RedisSingleOptions } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        process.env.NODE_ENV === 'production' ? '.env' : '.env.local',
      ],
      load: [configuration],
      validationSchema: configurationSchema,
      isGlobal: true,
    }),
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
    WalletModule,
  ],
})
export class AppModule {}
