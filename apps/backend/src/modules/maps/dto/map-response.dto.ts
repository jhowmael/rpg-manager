import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MapResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  campanha_id: string;

  @ApiProperty()
  nome: string;

  @ApiPropertyOptional()
  descricao?: string;

  @ApiPropertyOptional()
  imagem_id?: string;
}
