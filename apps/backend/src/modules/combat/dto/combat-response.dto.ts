import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CombatParticipantResponseDto } from './combat-participant-response.dto';
import { CombatPhaseDto } from './combat-request.dto';

export class CombatResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  campanha_id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  tempo_turno_minutos: number;

  @ApiProperty({ enum: CombatPhaseDto })
  fase: CombatPhaseDto;

  @ApiProperty()
  rodada_atual: number;

  @ApiProperty()
  turno_atual_index: number;

  @ApiPropertyOptional({ nullable: true })
  turno_iniciado_em: number | null;

  @ApiProperty({ type: [CombatParticipantResponseDto] })
  fighters: CombatParticipantResponseDto[];

  @ApiProperty()
  criado_em: string;

  @ApiPropertyOptional()
  encerrado_em?: string;
}
