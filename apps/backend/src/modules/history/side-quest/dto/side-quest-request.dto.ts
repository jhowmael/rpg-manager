import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export enum SideQuestStatus {
  ATIVA = 'ATIVA',
  INATIVA = 'INATIVA',
  CONCLUIDA = 'CONCLUIDA',
}

export class SideQuestRequestDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID('4', { message: 'O ID da campanha deve ser um UUID válido' })
  campanha_id: string;

  @ApiProperty({ example: 'O Artefato Perdido do Ferreiro' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString()
  titulo: string;

  @ApiProperty({
    example: '<p>O ferreiro perdeu um martelo encantado nas minas ao norte.</p>',
  })
  @IsNotEmpty({ message: 'O conteúdo é obrigatório' })
  @IsString()
  conteudo: string;

  @ApiPropertyOptional({ enum: SideQuestStatus, example: SideQuestStatus.INATIVA })
  @IsOptional()
  @IsEnum(SideQuestStatus, { message: 'Status inválido' })
  status?: SideQuestStatus;
}

export class SideQuestUpdateDto extends PartialType(SideQuestRequestDto) {}
