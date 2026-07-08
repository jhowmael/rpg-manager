import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export enum EffectTypeDto {
  BUFF = 'BUFF',
  DEBUFF = 'DEBUFF',
}

export class CombatStatusEffectRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  id?: string;

  @ApiProperty({ example: 'Escudo da Fé' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ enum: EffectTypeDto })
  @IsEnum(EffectTypeDto)
  tipo: EffectTypeDto;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  duracaoRodadas?: number;
}
