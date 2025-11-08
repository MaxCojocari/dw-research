import { Module } from '@nestjs/common';
import { ProjectionController } from './projection.controller';
import { ProjectionService } from './projection.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '@app/common';
import { Wallet } from '@app/common/entities/wallet.entity';

@Module({
  imports: [
    CommonModule,
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
    TypeOrmModule.forFeature([Wallet], 'shard-1'),
    TypeOrmModule.forFeature([Wallet], 'shard-2'),
  ],
  controllers: [ProjectionController],
  providers: [ProjectionService],
})
export class ProjectionModule {}
