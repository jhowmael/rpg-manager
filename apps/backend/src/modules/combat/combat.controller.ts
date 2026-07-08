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
import { CombatService } from './combat.service';
import { CombatRequestDto, CombatUpdateDto } from './dto/combat-request.dto';
import { CombatResponseDto } from './dto/combat-response.dto';

@ApiTags('combat')
@Controller('combat')
export class CombatController {
  constructor(private readonly combatService: CombatService) {}

  @Get()
  @ApiOperation({ summary: 'Listar combates por campanha' })
  @ApiQuery({ name: 'campanha_id', description: 'ID da campanha' })
  @ApiOkResponse({ type: CombatResponseDto, isArray: true })
  async findByCampaign(
    @Query('campanha_id') campanhaId: string,
  ): Promise<CombatResponseDto[]> {
    return this.combatService.findByCampaign(campanhaId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar combate' })
  @ApiCreatedResponse({ type: CombatResponseDto })
  async create(@Body() data: CombatRequestDto): Promise<CombatResponseDto> {
    return this.combatService.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar combate por ID' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: CombatResponseDto })
  @ApiNotFoundResponse()
  async findById(@Param('id') id: string): Promise<CombatResponseDto> {
    return this.combatService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar combate' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: CombatResponseDto })
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() data: CombatUpdateDto,
  ): Promise<CombatResponseDto> {
    return this.combatService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir combate' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: CombatResponseDto })
  @ApiNotFoundResponse()
  async delete(@Param('id') id: string): Promise<CombatResponseDto> {
    return this.combatService.delete(id);
  }
}
