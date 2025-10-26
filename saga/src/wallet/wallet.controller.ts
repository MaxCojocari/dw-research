import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { TransferBalanceDto } from './dto/transfer-balance.dto';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('balance_transfer')
  transfer(@Body() dto: TransferBalanceDto) {
    return this.walletService.transferBalance(dto);
  }

  @Get('balance')
  getBalance(
    @Query('account_id') accountId: string,
    @Query('currency') currency: string,
  ) {
    return this.walletService.getBalance(accountId, currency);
  }

  @Post()
  createWallet(@Body() dto: CreateWalletDto) {
    return this.walletService.createWallet(dto);
  }

  @Put(':account_id')
  updateWallet(
    @Param('account_id') accountId: string,
    @Body() dto: UpdateWalletDto,
  ) {
    return this.walletService.updateWallet(accountId, dto);
  }

  @Delete(':account_id')
  deleteWallet(@Param('account_id') accountId: string) {
    return this.walletService.deleteWallet(accountId);
  }
}
