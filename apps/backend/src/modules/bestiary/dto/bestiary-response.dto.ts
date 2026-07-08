import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BestiaryType } from './bestiary-request.dto';

export class BestiaryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  campanha_id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty({ enum: BestiaryType })
  tipo: string;

  @ApiPropertyOptional()
  imagem_id?: string;

  @ApiPropertyOptional()
  historia?: string;

  @ApiPropertyOptional()
  o_que_sabe?: string;

  @ApiPropertyOptional()
  personalidade?: string;

  @ApiPropertyOptional()
  familia_relacoes?: string;
}
