import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CombatStatusEffectResponseDto } from './combat-status-effect-response.dto';
import { FighterSourceDto, FighterStatusDto } from './combat-participant-request.dto';

export class CombatParticipantResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty({ enum: FighterSourceDto })
  source: FighterSourceDto;

  @ApiPropertyOptional()
  sourceId?: string;

  @ApiPropertyOptional()
  imagem?: string;

  @ApiProperty()
  vidaMaxima: number;

  @ApiProperty()
  vidaAtual: number;

  @ApiProperty()
  ca: number;

  @ApiPropertyOptional({ nullable: true })
  iniciativa: number | null;

  @ApiProperty()
  ordemVez: number;

  @ApiProperty({ enum: FighterStatusDto })
  status: FighterStatusDto;

  @ApiProperty({ type: [CombatStatusEffectResponseDto] })
  buffs: CombatStatusEffectResponseDto[];

  @ApiProperty({ type: [CombatStatusEffectResponseDto] })
  debuffs: CombatStatusEffectResponseDto[];
}
