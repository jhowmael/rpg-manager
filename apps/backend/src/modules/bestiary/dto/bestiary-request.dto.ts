import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export enum BestiaryType {
  NPC = 'NPC',
  MOB = 'MOB',
}

export class BestiaryRequestDto {
  @ApiProperty()
  @IsUUID('4')
  campanha_id: string;

  @ApiProperty({ example: 'Thorn, o Ferreiro' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiPropertyOptional({ example: 'Ferreiro da vila' })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiPropertyOptional({ example: 'Humano' })
  @IsOptional()
  @IsString()
  raca?: string;

  @ApiPropertyOptional({ example: 'Guerreiro' })
  @IsOptional()
  @IsString()
  classe?: string;

  @ApiProperty({ enum: BestiaryType })
  @IsEnum(BestiaryType)
  tipo: BestiaryType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagem_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  historia?: string;

  @ApiPropertyOptional({ example: 'Alto, cicatriz no olho, fala com sotaque do norte' })
  @IsOptional()
  @IsString()
  caracteristicas?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  o_que_sabe?: string;

  @ApiPropertyOptional({ type: [String], example: ['Bravo', 'Orgulhoso'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  personalidade?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  familia_relacoes?: string;
}

export class BestiaryUpdateDto extends PartialType(BestiaryRequestDto) {}
