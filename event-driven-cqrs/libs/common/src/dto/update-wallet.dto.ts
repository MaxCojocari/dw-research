import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateWalletDto {
  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @IsOptional()
  balance?: number;
}
