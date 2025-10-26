import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GetBalanceDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsOptional()
  currency: string = 'USD';
}
