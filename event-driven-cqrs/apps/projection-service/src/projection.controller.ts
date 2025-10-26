import { Controller } from '@nestjs/common';
import { ProjectionService } from './projection.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateWalletDto } from '../../../libs/common/src/dto/create-wallet.dto';
import { UpdateWalletDto } from '../../../libs/common/src/dto/update-wallet.dto';

@Controller()
export class ProjectionController {
  constructor(private readonly projectionService: ProjectionService) {}

  @EventPattern('wallet.updateBalance')
  updateBalance(@Payload() dto: UpdateBalanceDto) {
    this.projectionService.updateBalance(dto);
  }

  @EventPattern('wallet.create')
  createWallet(@Payload() dto: CreateWalletDto) {
    this.projectionService.createWallet(dto);
  }

  @EventPattern('wallet.update')
  updateWallet(@Payload() dto: UpdateWalletDto) {
    this.projectionService.updateWallet(dto);
  }

  @EventPattern('wallet.delete')
  deleteWallet(@Payload() dto: { accountId: string }) {
    this.projectionService.deleteWallet(dto);
  }
}
