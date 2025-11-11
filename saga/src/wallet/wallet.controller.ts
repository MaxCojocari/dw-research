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

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('balanceTransfer')
  transfer(@Body() dto: TransferBalanceDto) {
    return this.walletService.transferBalance(dto);
  }

  @Get(':accountId/balance')
  getBalance(
    @Param('accountId') accountId: string,
    @Query('currency') currency: string,
  ) {
    return this.walletService.getBalance(accountId, currency);
  }

  @Post()
  createWallet(@Body() dto: CreateWalletDto) {
    return this.walletService.createWallet(dto);
  }

  @Put(':accountId')
  updateWallet(
    @Param('accountId') accountId: string,
    @Body() dto: UpdateWalletDto,
  ) {
    return this.walletService.updateWallet(accountId, dto);
  }

  @Delete(':accountId')
  deleteWallet(@Param('accountId') accountId: string) {
    return this.walletService.deleteWallet(accountId);
  }
}
