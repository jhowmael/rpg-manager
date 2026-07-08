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
import { HeroService } from './hero.service';
import { HeroRequestDto, HeroUpdateDto } from './dto/hero-request.dto';
import { HeroResponseDto } from './dto/hero-response.dto';

@ApiTags('hero')
@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  @ApiOperation({ summary: 'Listar heróis por campanha' })
  @ApiQuery({ name: 'campanha_id', description: 'ID da campanha' })
  @ApiOkResponse({ type: HeroResponseDto, isArray: true })
  async findByCampaign(
    @Query('campanha_id') campanhaId: string,
  ): Promise<HeroResponseDto[]> {
    return this.heroService.findByCampaign(campanhaId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar herói' })
  @ApiCreatedResponse({ type: HeroResponseDto })
  async create(@Body() data: HeroRequestDto): Promise<HeroResponseDto> {
    return this.heroService.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar herói por ID' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: HeroResponseDto })
  @ApiNotFoundResponse()
  async findById(@Param('id') id: string): Promise<HeroResponseDto> {
    return this.heroService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar herói' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: HeroResponseDto })
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() data: HeroUpdateDto,
  ): Promise<HeroResponseDto> {
    return this.heroService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir herói' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: HeroResponseDto })
  @ApiNotFoundResponse()
  async delete(@Param('id') id: string): Promise<HeroResponseDto> {
    return this.heroService.delete(id);
  }
}
