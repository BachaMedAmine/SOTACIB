import { IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';

export class EditEventDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  clientName?: string; // Client name added

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