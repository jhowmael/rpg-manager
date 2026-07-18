import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class MapRequestDto {
  @ApiProperty()
  @IsUUID('4')
  campanha_id: string;

  @ApiProperty({ example: 'Floresta de Eldenwood' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiPropertyOptional({
    example: 'Região densa com trilhas ocultas e um rio serpenteando ao sul.',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagem_id?: string;
}

export class MapUpdateDto extends PartialType(MapRequestDto) {}
