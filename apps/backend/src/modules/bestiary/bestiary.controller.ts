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
import { BestiaryService } from './bestiary.service';
import { BestiaryRequestDto, BestiaryUpdateDto } from './dto/bestiary-request.dto';
import { BestiaryResponseDto } from './dto/bestiary-response.dto';

@ApiTags('bestiary')
@Controller('bestiary')
export class BestiaryController {
  constructor(private readonly bestiaryService: BestiaryService) {}

  @Get()
  @ApiOperation({ summary: 'Listar NPCs e Mobs por campanha' })
  @ApiQuery({ name: 'campanha_id', description: 'ID da campanha' })
  @ApiOkResponse({ type: BestiaryResponseDto, isArray: true })
  async findByCampaign(
    @Query('campanha_id') campanhaId: string,
  ): Promise<BestiaryResponseDto[]> {
    return this.bestiaryService.findByCampaign(campanhaId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar NPC ou Mob' })
  @ApiCreatedResponse({ type: BestiaryResponseDto })
  async create(@Body() data: BestiaryRequestDto): Promise<BestiaryResponseDto> {
    return this.bestiaryService.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar entrada por ID' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: BestiaryResponseDto })
  @ApiNotFoundResponse()
  async findById(@Param('id') id: string): Promise<BestiaryResponseDto> {
    return this.bestiaryService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar NPC ou Mob' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: BestiaryResponseDto })
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() data: BestiaryUpdateDto,
  ): Promise<BestiaryResponseDto> {
    return this.bestiaryService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir NPC ou Mob' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: BestiaryResponseDto })
  @ApiNotFoundResponse()
  async delete(@Param('id') id: string): Promise<BestiaryResponseDto> {
    return this.bestiaryService.delete(id);
  }
}
