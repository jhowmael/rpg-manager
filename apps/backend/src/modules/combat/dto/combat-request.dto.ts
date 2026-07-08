import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { CombatParticipantRequestDto } from './combat-participant-request.dto';

export enum CombatPhaseDto {
  setup = 'setup',
  initiative = 'initiative',
  battle = 'battle',
  finished = 'finished',
}

export class CombatRequestDto {
  @ApiProperty()
  @IsUUID('4')
  campanha_id: string;

  @ApiPropertyOptional({ example: 'Emboscada nas Minas' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  tempo_turno_minutos?: number;

  @ApiPropertyOptional({ enum: CombatPhaseDto, example: CombatPhaseDto.setup })
  @IsOptional()
  @IsEnum(CombatPhaseDto)
  fase?: CombatPhaseDto;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  rodada_atual?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  turno_atual_index?: number;

  @ApiPropertyOptional({ description: 'Timestamp em milissegundos', nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  turno_iniciado_em?: number | null;

  @ApiPropertyOptional({ type: [CombatParticipantRequestDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CombatParticipantRequestDto)
  fighters?: CombatParticipantRequestDto[];

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  encerrado_em?: string | null;
}

export class CombatUpdateDto extends PartialType(CombatRequestDto) {}
