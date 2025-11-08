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

@Controller('wallet')
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('balance_transfer')
  transfer(@Body() dto: TransferBalanceDto) {
    return this.apiGatewayService.transferBalance(dto);
  }

  @Get('balance')
  getBalance(
    @Query('account_id') accountId: string,
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

  @Put(':account_id')
  updateWallet(
    @Param('account_id') accountId: string,
    @Body() dto: UpdateWalletDto,
  ) {
    return this.apiGatewayService.updateWallet(accountId, dto);
  }

  @Delete(':account_id')
  deleteWallet(@Param('account_id') accountId: string) {
    return this.apiGatewayService.deleteWallet(accountId);
  }
}
