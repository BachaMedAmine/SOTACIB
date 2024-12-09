import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsArray } from 'class-validator';

export class AjouterClientDto {
  @IsNotEmpty()
  @IsString()
  readonly responsable: string;

  @IsNotEmpty()
  @IsString()
  readonly clientNom: string;

  @IsNotEmpty()
  @IsString()
  readonly clientType: 'G' | 'D' | 'NC';

  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsNumber()
  readonly telephone: number;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsNotEmpty()
  @IsString()
  readonly gouvernoratId: string;

  @IsNotEmpty()
  @IsString()
  readonly delegationId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProduitConcurentPrixDto)
  produits: ProduitConcurentPrixDto[];
}

class ProduitConcurentPrixDto {
  @IsNotEmpty()
  @IsString()
  readonly concurentId: string;

  @IsNotEmpty()
  @IsString()
  readonly produitId: string;

  @IsNotEmpty()
  @IsNumber()
  readonly prix: number;
}
