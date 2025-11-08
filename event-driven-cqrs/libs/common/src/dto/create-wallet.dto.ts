import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  @IsOptional()
  balance?: number = 0;
}
