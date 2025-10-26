import { Inject, Injectable } from '@nestjs/common';
import { COMMAND_SERVICE, QUERY_SERVICE } from '@app/common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TransferBalanceDto } from '@app/common/dto/transfer-balance.dto';
import { CreateWalletDto } from '@app/common/dto/create-wallet.dto';
import { UpdateWalletDto } from '@app/common/dto/update-wallet.dto';
import { GetBalanceDto } from '../../../libs/common/src/dto/get-balance.dto';

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject(COMMAND_SERVICE)
    private readonly commandService: ClientProxy,
    @Inject(QUERY_SERVICE)
    private readonly queryService: ClientProxy,
  ) {}

  async getBalance(dto: GetBalanceDto) {
    const wallet = await lastValueFrom(
      this.queryService.send('query.getBalance', dto),
    );
    console.log({ wallet });
    return wallet;
  }

  async transferBalance(dto: TransferBalanceDto) {
    const res = await lastValueFrom(
      this.commandService.send('command.transferBalance', dto),
    );
    console.log({ res });
    return res;
  }

  async createWallet(dto: CreateWalletDto) {
    const res = await lastValueFrom(
      this.commandService.send('command.createWallet', dto),
    );
    console.log({ res });
    return res;
  }

  async updateWallet(accountId: string, dto: UpdateWalletDto) {
    const res = await lastValueFrom(
      this.commandService.send('command.updateWallet', { accountId, ...dto }),
    );
    console.log({ res });
    return res;
  }

  async deleteWallet(accountId: string) {
    const res = await lastValueFrom(
      this.commandService.send('command.updateWallet', { accountId }),
    );
    console.log({ res });
    return res;
  }
}
