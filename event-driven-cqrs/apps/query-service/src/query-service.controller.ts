import { Controller, Get } from '@nestjs/common';
import { QueryServiceService } from './query-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetBalanceDto } from '../../../libs/common/src/dto/get-balance.dto';

@Controller()
export class QueryServiceController {
  constructor(private readonly queryServiceService: QueryServiceService) {}

  @MessagePattern('query.getBalance')
  getBalance(@Payload() dto: GetBalanceDto) {
    return this.queryServiceService.getBalance(dto);
  }
}
