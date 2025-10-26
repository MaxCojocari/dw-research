import { Controller } from '@nestjs/common';
import { CommandServiceService } from './command-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransferBalanceDto } from '@app/common/dto/transfer-balance.dto';
import { UpdateWalletDto } from '@app/common/dto/update-wallet.dto';
import { CreateWalletDto } from '@app/common/dto/create-wallet.dto';

@Controller()
export class CommandServiceController {
  constructor(private readonly commandServiceService: CommandServiceService) {}

  @MessagePattern('command.transferBalance')
  transferBalance(@Payload() dto: TransferBalanceDto) {
    return this.commandServiceService.transferBalance(dto);
  }

  @MessagePattern('command.createWallet')
  createWallet(@Payload() dto: CreateWalletDto) {
    return this.commandServiceService.createWallet(dto);
  }

  @MessagePattern('command.updateWallet')
  updateWallet(@Payload() dto: UpdateWalletDto & { accountId: string }) {
    return this.commandServiceService.updateWallet(dto);
  }

  @MessagePattern('command.deleteWallet')
  deleteWallet(@Payload() dto: { accountId: string }) {
    return this.commandServiceService.deleteWallet(dto);
  }
}
