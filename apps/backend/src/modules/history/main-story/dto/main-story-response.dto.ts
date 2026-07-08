import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MainStoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  campanha_id: string;

  @ApiProperty()
  titulo: string;

  @ApiPropertyOptional()
  conteudo?: string;

  @ApiProperty()
  ordem: number;
}
