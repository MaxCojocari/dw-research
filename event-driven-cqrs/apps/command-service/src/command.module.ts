import { Module } from '@nestjs/common';
import { CommandController } from './command.controller';
import { CommandService } from './command.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PROJECTION_SERVICE } from '@app/common/constants';
import { CommonModule } from '@app/common';
import { Wallet } from '@app/common/entities/wallet.entity';
import { Event } from '@app/common/entities/event.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    CommonModule,
    ClientsModule.registerAsync([
      {
        name: PROJECTION_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('rabbit.url')],
            queue: configService.get('queue'),
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    TypeOrmModule.forRootAsync({
      name: 'event-store',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.eventStore.host'),
        port: configService.get('database.eventStore.port'),
        username: configService.get('database.eventStore.user'),
        password: configService.get('database.eventStore.password'),
        database: configService.get('database.eventStore.db'),
        autoLoadEntities: true,
        synchronize: true,
      }),
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
    TypeOrmModule.forFeature([Event], 'event-store'),
    TypeOrmModule.forFeature([Wallet], 'shard-1'),
    TypeOrmModule.forFeature([Wallet], 'shard-2'),
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  controllers: [CommandController],
  providers: [CommandService],
})
export class CommandModule {}
