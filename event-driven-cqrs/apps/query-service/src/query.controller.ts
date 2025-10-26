import { Controller } from '@nestjs/common';
import { QueryService } from './query.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetBalanceDto } from '../../../libs/common/src/dto/get-balance.dto';

@Controller()
export class QueryController {
  constructor(private readonly queryServiceService: QueryService) {}

  @MessagePattern('query.getBalance')
  getBalance(@Payload() dto: GetBalanceDto) {
    return this.queryServiceService.getBalance(dto);
  }
}
