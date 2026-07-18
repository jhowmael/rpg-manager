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
import { MapsService } from './maps.service';
import { MapRequestDto, MapUpdateDto } from './dto/map-request.dto';
import { MapResponseDto } from './dto/map-response.dto';

@ApiTags('maps')
@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar mapas por campanha' })
  @ApiQuery({ name: 'campanha_id', description: 'ID da campanha' })
  @ApiOkResponse({ type: MapResponseDto, isArray: true })
  async findByCampaign(
    @Query('campanha_id') campanhaId: string,
  ): Promise<MapResponseDto[]> {
    return this.mapsService.findByCampaign(campanhaId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar mapa' })
  @ApiCreatedResponse({ type: MapResponseDto })
  async create(@Body() data: MapRequestDto): Promise<MapResponseDto> {
    return this.mapsService.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar mapa por ID' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: MapResponseDto })
  @ApiNotFoundResponse()
  async findById(@Param('id') id: string): Promise<MapResponseDto> {
    return this.mapsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar mapa' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: MapResponseDto })
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() data: MapUpdateDto,
  ): Promise<MapResponseDto> {
    return this.mapsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir mapa' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: MapResponseDto })
  @ApiNotFoundResponse()
  async delete(@Param('id') id: string): Promise<MapResponseDto> {
    return this.mapsService.delete(id);
  }
}
