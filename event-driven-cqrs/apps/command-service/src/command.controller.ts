import { Controller } from '@nestjs/common';
import { CommandService } from './command.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransferBalanceDto } from '@app/common/dto/transfer-balance.dto';
import { UpdateWalletDto } from '@app/common/dto/update-wallet.dto';
import { CreateWalletDto } from '@app/common/dto/create-wallet.dto';

@Controller()
export class CommandController {
  constructor(private readonly commandService: CommandService) {}

  @MessagePattern('command.transferBalance')
  transferBalance(@Payload() dto: TransferBalanceDto) {
    return this.commandService.transferBalance(dto);
  }

  @MessagePattern('command.createWallet')
  createWallet(@Payload() dto: CreateWalletDto) {
    return this.commandService.createWallet(dto);
  }

  @MessagePattern('command.updateWallet')
  updateWallet(@Payload() dto: UpdateWalletDto & { accountId: string }) {
    return this.commandService.updateWallet(dto);
  }

  @MessagePattern('command.deleteWallet')
  deleteWallet(@Payload() dto: { accountId: string }) {
    return this.commandService.deleteWallet(dto);
  }
}
