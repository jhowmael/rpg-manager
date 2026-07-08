import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SideQuestService } from './side-quest.service';
import { SideQuestRequestDto, SideQuestUpdateDto } from './dto/side-quest-request.dto';
import { SideQuestResponseDto } from './dto/side-quest-response.dto';

@ApiTags('history/side-quest')
@Controller('history/side-quest')
export class SideQuestController {
  constructor(private readonly sideQuestService: SideQuestService) {}

  @Get()
  @ApiOperation({ summary: 'Listar side quests por campanha' })
  @ApiQuery({ name: 'campanha_id', description: 'ID da campanha' })
  @ApiOkResponse({ type: SideQuestResponseDto, isArray: true })
  async findByCampaign(
    @Query('campanha_id') campanhaId: string,
  ): Promise<SideQuestResponseDto[]> {
    return this.sideQuestService.findByCampaign(campanhaId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar side quest' })
  @ApiCreatedResponse({ type: SideQuestResponseDto })
  async create(@Body() data: SideQuestRequestDto): Promise<SideQuestResponseDto> {
    return this.sideQuestService.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar side quest por ID' })
  @ApiParam({ name: 'id', description: 'ID da side quest' })
  @ApiOkResponse({ type: SideQuestResponseDto })
  @ApiNotFoundResponse({ description: 'Side quest não encontrada' })
  async findById(@Param('id') id: string): Promise<SideQuestResponseDto> {
    return this.sideQuestService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar side quest' })
  @ApiParam({ name: 'id', description: 'ID da side quest' })
  @ApiOkResponse({ type: SideQuestResponseDto })
  @ApiNotFoundResponse({ description: 'Side quest não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() data: SideQuestUpdateDto,
  ): Promise<SideQuestResponseDto> {
    return this.sideQuestService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir side quest' })
  @ApiParam({ name: 'id', description: 'ID da side quest' })
  @ApiOkResponse({ type: SideQuestResponseDto })
  @ApiNotFoundResponse({ description: 'Side quest não encontrada' })
  async delete(@Param('id') id: string): Promise<SideQuestResponseDto> {
    return this.sideQuestService.delete(id);
  }
}
