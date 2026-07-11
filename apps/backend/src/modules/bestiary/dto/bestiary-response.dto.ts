import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BestiaryType } from './bestiary-request.dto';

export class BestiaryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  campanha_id: string;

  @ApiProperty()
  nome: string;

  @ApiPropertyOptional()
  titulo?: string;

  @ApiPropertyOptional()
  raca?: string;

  @ApiPropertyOptional()
  classe?: string;

  @ApiProperty({ enum: BestiaryType })
  tipo: string;

  @ApiPropertyOptional()
  imagem_id?: string;

  @ApiPropertyOptional()
  historia?: string;

  @ApiPropertyOptional()
  caracteristicas?: string;

  @ApiPropertyOptional()
  o_que_sabe?: string;

  @ApiPropertyOptional({ type: [String] })
  personalidade?: string[];

  @ApiPropertyOptional()
  familia_relacoes?: string;
}
