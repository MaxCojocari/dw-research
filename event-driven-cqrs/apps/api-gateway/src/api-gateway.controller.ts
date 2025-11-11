import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { CreateWalletDto } from '@app/common/dto/create-wallet.dto';
import { TransferBalanceDto } from '@app/common/dto/transfer-balance.dto';
import { UpdateWalletDto } from '@app/common/dto/update-wallet.dto';

@Controller('wallets')
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('balanceTransfer')
  transfer(@Body() dto: TransferBalanceDto) {
    return this.apiGatewayService.transferBalance(dto);
  }

  @Get(':accountId/balance')
  getBalance(
    @Param('accountId') accountId: string,
    @Query('currency') currency: string,
  ) {
    return this.apiGatewayService.getBalance({
      accountId,
      currency,
    });
  }

  @Post()
  createWallet(@Body() dto: CreateWalletDto) {
    return this.apiGatewayService.createWallet(dto);
  }

  @Put(':accountId')
  updateWallet(
    @Param('accountId') accountId: string,
    @Body() dto: UpdateWalletDto,
  ) {
    return this.apiGatewayService.updateWallet(accountId, dto);
  }

  @Delete(':accountId')
  deleteWallet(@Param('accountId') accountId: string) {
    return this.apiGatewayService.deleteWallet(accountId);
  }
}
