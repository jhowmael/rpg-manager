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
import { MainStoryService } from './main-story.service';
import { MainStoryRequestDto, MainStoryUpdateDto } from './dto/main-story-request.dto';
import { MainStoryResponseDto } from './dto/main-story-response.dto';

@ApiTags('history/main-story')
@Controller('history/main-story')
export class MainStoryController {
  constructor(private readonly mainStoryService: MainStoryService) {}

  @Get()
  @ApiOperation({ summary: 'Listar capítulos da história principal por campanha' })
  @ApiQuery({ name: 'campanha_id', description: 'ID da campanha' })
  @ApiOkResponse({ type: MainStoryResponseDto, isArray: true })
  async findByCampaign(
    @Query('campanha_id') campanhaId: string,
  ): Promise<MainStoryResponseDto[]> {
    return this.mainStoryService.findByCampaign(campanhaId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar capítulo da história principal' })
  @ApiCreatedResponse({ type: MainStoryResponseDto })
  async create(@Body() data: MainStoryRequestDto): Promise<MainStoryResponseDto> {
    return this.mainStoryService.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar capítulo por ID' })
  @ApiParam({ name: 'id', description: 'ID do capítulo' })
  @ApiOkResponse({ type: MainStoryResponseDto })
  @ApiNotFoundResponse({ description: 'Capítulo não encontrado' })
  async findById(@Param('id') id: string): Promise<MainStoryResponseDto> {
    return this.mainStoryService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar capítulo' })
  @ApiParam({ name: 'id', description: 'ID do capítulo' })
  @ApiOkResponse({ type: MainStoryResponseDto })
  @ApiNotFoundResponse({ description: 'Capítulo não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() data: MainStoryUpdateDto,
  ): Promise<MainStoryResponseDto> {
    return this.mainStoryService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir capítulo' })
  @ApiParam({ name: 'id', description: 'ID do capítulo' })
  @ApiOkResponse({ type: MainStoryResponseDto })
  @ApiNotFoundResponse({ description: 'Capítulo não encontrado' })
  async delete(@Param('id') id: string): Promise<MainStoryResponseDto> {
    return this.mainStoryService.delete(id);
  }
}
