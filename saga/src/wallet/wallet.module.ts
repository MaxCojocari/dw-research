import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet], 'shard-1'),
    TypeOrmModule.forFeature([Wallet], 'shard-2'),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
