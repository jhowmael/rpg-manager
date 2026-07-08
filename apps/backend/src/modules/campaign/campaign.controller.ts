import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { CampaignRequestDto, CampaignUpdateDto } from './dto/campaign-request.dto';
import { CampaignResponseDto } from './dto/campaign-response.dto';

@ApiTags('campaign')
@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @ApiOperation({ summary: 'Criar campanha' })
  @ApiCreatedResponse({ type: CampaignResponseDto })
  async create(@Body() data: CampaignRequestDto): Promise<CampaignResponseDto> {
    return this.campaignService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar campanhas' })
  @ApiOkResponse({ type: CampaignResponseDto, isArray: true })
  async findAll(): Promise<CampaignResponseDto[]> {
    return this.campaignService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar campanha por ID' })
  @ApiParam({ name: 'id', description: 'ID da campanha' })
  @ApiOkResponse({ type: CampaignResponseDto })
  @ApiNotFoundResponse({ description: 'Campanha não encontrada' })
  async findById(@Param('id') id: string): Promise<CampaignResponseDto> {
    return this.campaignService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar campanha' })
  @ApiParam({ name: 'id', description: 'ID da campanha' })
  @ApiOkResponse({ type: CampaignResponseDto })
  @ApiNotFoundResponse({ description: 'Campanha não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() data: CampaignUpdateDto,
  ): Promise<CampaignResponseDto> {
    return this.campaignService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir campanha' })
  @ApiParam({ name: 'id', description: 'ID da campanha' })
  @ApiOkResponse({ type: CampaignResponseDto })
  @ApiNotFoundResponse({ description: 'Campanha não encontrada' })
  async delete(@Param('id') id: string): Promise<CampaignResponseDto> {
    return this.campaignService.delete(id);
  }
}
