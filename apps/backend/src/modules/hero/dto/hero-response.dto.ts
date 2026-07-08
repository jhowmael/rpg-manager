import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HeroResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  campanha_id: string;

  @ApiProperty()
  nome: string;

  @ApiPropertyOptional()
  raca?: string;

  @ApiPropertyOptional()
  classe?: string;

  @ApiPropertyOptional()
  historia?: string;

  @ApiPropertyOptional()
  imagem_id?: string;
}
