import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class HeroRequestDto {
  @ApiProperty()
  @IsUUID('4')
  campanha_id: string;

  @ApiProperty({ example: 'Kaelen Voss' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiPropertyOptional({ example: 'Humano' })
  @IsOptional()
  @IsString()
  raca?: string;

  @ApiPropertyOptional({ example: 'Guerreiro' })
  @IsOptional()
  @IsString()
  classe?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  historia?: string;

  @ApiPropertyOptional({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479.webp' })
  @IsOptional()
  @IsString()
  imagem_id?: string;
}

export class HeroUpdateDto extends PartialType(HeroRequestDto) {}
