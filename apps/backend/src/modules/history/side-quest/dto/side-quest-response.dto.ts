import { ApiProperty } from '@nestjs/swagger';
import { SideQuestStatus } from './side-quest-request.dto';

export class SideQuestResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  campanha_id: string;

  @ApiProperty()
  titulo: string;

  @ApiProperty()
  conteudo: string;

  @ApiProperty({ enum: SideQuestStatus })
  status: string;
}
