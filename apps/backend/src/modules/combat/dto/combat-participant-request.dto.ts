import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { CombatStatusEffectRequestDto } from './combat-status-effect-request.dto';

export enum FighterSourceDto {
  HERO = 'HERO',
  NPC = 'NPC',
  MOB = 'MOB',
  CUSTOM = 'CUSTOM',
}

export enum FighterStatusDto {
  active = 'active',
  dead = 'dead',
  fled = 'fled',
}

export class CombatParticipantRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  id?: string;

  @ApiProperty({ example: 'Kaelen Voss' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ enum: FighterSourceDto })
  @IsEnum(FighterSourceDto)
  source: FighterSourceDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  sourceId?: string;

  @ApiProperty({ example: 30 })
  @IsInt()
  @Min(0)
  vidaMaxima: number;

  @ApiProperty({ example: 30 })
  @IsInt()
  @Min(0)
  vidaAtual: number;

  @ApiProperty({ example: 16 })
  @IsInt()
  @Min(0)
  ca: number;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  iniciativa?: number | null;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  ordemVez: number;

  @ApiProperty({ enum: FighterStatusDto, example: FighterStatusDto.active })
  @IsEnum(FighterStatusDto)
  status: FighterStatusDto;

  @ApiPropertyOptional({ type: [CombatStatusEffectRequestDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CombatStatusEffectRequestDto)
  buffs?: CombatStatusEffectRequestDto[];

  @ApiPropertyOptional({ type: [CombatStatusEffectRequestDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CombatStatusEffectRequestDto)
  debuffs?: CombatStatusEffectRequestDto[];
}
