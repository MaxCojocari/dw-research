import { Inject, Injectable } from '@nestjs/common';
import { COMMAND_SERVICE, QUERY_SERVICE } from '@app/common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TransferBalanceDto } from '@app/common/dto/transfer-balance.dto';
import { CreateWalletDto } from '@app/common/dto/create-wallet.dto';
import { UpdateWalletDto } from '@app/common/dto/update-wallet.dto';
import { GetBalanceDto } from '@app/common/dto/get-balance.dto';
import { promisifyObservable } from '../../../libs/common/src/utils/observable';
import { raiseHttpException } from '../../../libs/common/src/utils/exception-mapper';

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
    return wallet;
  }

  async transferBalance(dto: TransferBalanceDto) {
    try {
      const res = await lastValueFrom(
        this.commandService.send('command.transferBalance', dto),
      );
      return res;
    } catch (error) {
      if (error?.message && error?.code) {
        raiseHttpException(error.code, error.message);
      }
      throw error;
    }
  }

  async createWallet(dto: CreateWalletDto) {
    try {
      const res = await promisifyObservable(
        this.commandService.send('command.createWallet', dto),
      );
      return res;
    } catch (error) {
      if (error?.message && error?.code) {
        raiseHttpException(error.code, error.message);
      }
      throw error;
    }
  }

  async updateWallet(accountId: string, dto: UpdateWalletDto) {
    try {
      const res = await promisifyObservable(
        this.commandService.send('command.updateWallet', { accountId, ...dto }),
      );
      return res;
    } catch (error) {
      if (error?.message && error?.code) {
        raiseHttpException(error.code, error.message);
      }
      throw error;
    }
  }

  async deleteWallet(accountId: string) {
    try {
      const res = await promisifyObservable(
        this.commandService.send('command.deleteWallet', { accountId }),
      );
      return res;
    } catch (error) {
      if (error?.message && error?.code) {
        raiseHttpException(error.code, error.message);
      }
      throw error;
    }
  }
}
