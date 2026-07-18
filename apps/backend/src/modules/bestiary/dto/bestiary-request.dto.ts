import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export enum BestiaryType {
  NPC = 'NPC',
  MOB = 'MOB',
}

export class CharacterAttributesDto {
  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  @Max(30)
  forca: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  @Max(30)
  destreza: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  @Max(30)
  constituicao: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  @Max(30)
  inteligencia: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  @Max(30)
  sabedoria: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  @Max(30)
  carisma: number;
}

export class CharacterAbilityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Ataque Furtivo' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiPropertyOptional({ example: 'Causa dano extra quando tem vantagem.' })
  @IsOptional()
  @IsString()
  descricao?: string;
}

export class BestiaryRequestDto {
  @ApiProperty()
  @IsUUID('4')
  campanha_id: string;

  @ApiProperty({ example: 'Thorn, o Ferreiro' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiPropertyOptional({ example: 'Ferreiro da vila' })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiPropertyOptional({ example: 'Humano' })
  @IsOptional()
  @IsString()
  raca?: string;

  @ApiPropertyOptional({ example: 'Guerreiro' })
  @IsOptional()
  @IsString()
  classe?: string;

  @ApiProperty({ enum: BestiaryType })
  @IsEnum(BestiaryType)
  tipo: BestiaryType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagem_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  historia?: string;

  @ApiPropertyOptional({ example: 'Alto, cicatriz no olho, fala com sotaque do norte' })
  @IsOptional()
  @IsString()
  caracteristicas?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  o_que_sabe?: string;

  @ApiPropertyOptional({ type: [String], example: ['Bravo', 'Orgulhoso'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  personalidade?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  familia_relacoes?: string;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  vida_maxima?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsInt()
  @Min(0)
  ca?: number;

  @ApiPropertyOptional({ type: CharacterAttributesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CharacterAttributesDto)
  atributos?: CharacterAttributesDto;

  @ApiPropertyOptional({ type: [CharacterAbilityDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CharacterAbilityDto)
  habilidades?: CharacterAbilityDto[];
}

export class BestiaryUpdateDto extends PartialType(BestiaryRequestDto) {}
