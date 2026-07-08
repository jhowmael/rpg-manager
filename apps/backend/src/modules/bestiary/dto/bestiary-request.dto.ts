import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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

  @ApiProperty({ enum: BestiaryType })
  @IsEnum(BestiaryType)
  tipo: BestiaryType;

  @ApiPropertyOptional({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479.webp' })
  @IsOptional()
  @IsString()
  imagem_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  historia?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  o_que_sabe?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  personalidade?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  familia_relacoes?: string;
}

export class BestiaryUpdateDto extends PartialType(BestiaryRequestDto) {}
