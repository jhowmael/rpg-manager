import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CampaignResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ example: 'A Queda de Valoria' })
  nome: string;

  @ApiPropertyOptional({
    example: 'Os heróis devem impedir que o Lich Malachar ressuscite o exército das sombras.',
  })
  descricao?: string;

  @ApiPropertyOptional({ example: 'D&D 5e' })
  sistema_rpg?: string;

  @ApiProperty({ example: '2026-03-15T10:00:00.000Z' })
  criado_em: Date;
}
