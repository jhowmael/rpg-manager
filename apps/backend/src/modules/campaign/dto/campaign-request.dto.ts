import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CampaignRequestDto {
  @ApiProperty({
    example: 'A Queda de Valoria',
    description: 'Nome da campanha',
  })
  @IsNotEmpty({ message: 'O nome da campanha é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  nome: string;

  @ApiPropertyOptional({
    example: 'Os heróis devem impedir que o Lich Malachar ressuscite o exército das sombras.',
    description: 'Descrição da campanha',
  })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  descricao?: string;

  @ApiPropertyOptional({
    example: 'D&D 5e',
    description: 'Sistema de RPG utilizado na campanha',
  })
  @IsOptional()
  @IsString({ message: 'O sistema de RPG deve ser uma string' })
  sistema_rpg?: string;
}

export class CampaignUpdateDto extends PartialType(CampaignRequestDto) {}
