import { IsString, IsNotEmpty, IsIn, IsNumber } from 'class-validator';

export class TransferBalanceDto {
  @IsString()
  @IsNotEmpty()
  fromAccount: string;

  @IsString()
  @IsNotEmpty()
  toAccount: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['USD', 'EUR', 'GBP'])
  currency: string;
}
