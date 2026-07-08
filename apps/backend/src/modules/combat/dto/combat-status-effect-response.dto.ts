import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EffectTypeDto } from './combat-status-effect-request.dto';

export class CombatStatusEffectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty({ enum: EffectTypeDto })
  tipo: EffectTypeDto;

  @ApiPropertyOptional()
  duracaoRodadas?: number;
}
