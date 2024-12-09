import { IsNotEmpty, IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';

export class AddEventDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  clientName: string; // Client name added

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}