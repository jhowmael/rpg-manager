import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class MainStoryRequestDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID('4', { message: 'O ID da campanha deve ser um UUID válido' })
  campanha_id: string;

  @ApiProperty({ example: 'Capítulo I — O Despertar das Sombras' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString()
  titulo: string;

  @ApiPropertyOptional({
    example: '<h2>Prólogo</h2><p>Na cidade de <strong>Valoria</strong>...</p>',
  })
  @IsOptional()
  @IsString()
  conteudo?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  ordem?: number;
}

export class MainStoryUpdateDto extends PartialType(
  MainStoryRequestDto,
) {}
