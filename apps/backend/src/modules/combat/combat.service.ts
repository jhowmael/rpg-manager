import { Injectable, NotFoundException } from '@nestjs/common';
import { CombatRepository } from './combat.repository';
import { CombatRequestDto, CombatUpdateDto } from './dto/combat-request.dto';
import { CombatResponseDto } from './dto/combat-response.dto';
import { CombatParticipantResponseDto } from './dto/combat-participant-response.dto';
import { CombatStatusEffectResponseDto } from './dto/combat-status-effect-response.dto';
import { FighterSourceDto } from './dto/combat-participant-request.dto';

@Injectable()
export class CombatService {
  constructor(private readonly repository: CombatRepository) {}

  async findByCampaign(campanha_id: string): Promise<CombatResponseDto[]> {
    const combats = await this.repository.findByCampaign(campanha_id);
    return combats.map(combat => this.toResponse(combat));
  }

  async findById(id: string): Promise<CombatResponseDto> {
    const combat = await this.repository.findById(id);
    if (!combat) {
      throw new NotFoundException('Combate não encontrado');
    }
    return this.toResponse(combat);
  }

  async create(data: CombatRequestDto): Promise<CombatResponseDto> {
    const combat = await this.repository.create(data);
    return this.toResponse(combat);
  }

  async update(id: string, data: CombatUpdateDto): Promise<CombatResponseDto> {
    await this.findById(id);
    const combat = await this.repository.update(id, data);
    return this.toResponse(combat);
  }

  async delete(id: string): Promise<CombatResponseDto> {
    const combat = await this.findById(id);
    await this.repository.delete(id);
    return combat;
  }

  private toResponse(combat: Awaited<ReturnType<CombatRepository['findById']>> & object): CombatResponseDto {
    if (!combat) {
      throw new NotFoundException('Combate não encontrado');
    }

    return {
      id: combat.id,
      campanha_id: combat.campanha_id,
      nome: combat.nome_encontro,
      tempo_turno_minutos: combat.tempo_turno_minutos,
      fase: combat.fase as CombatResponseDto['fase'],
      rodada_atual: combat.rodada_atual,
      turno_atual_index: combat.turno_atual_index,
      turno_iniciado_em: combat.turno_iniciado_em
        ? combat.turno_iniciado_em.getTime()
        : null,
      fighters: combat.participants.map(participant => this.toFighterResponse(participant)),
      criado_em: combat.criado_em.toISOString(),
      encerrado_em: combat.encerrado_em?.toISOString(),
    };
  }

  private toFighterResponse(
    participant: {
      id: string;
      nome_combate: string;
      tipo_participante: string;
      jogador_id: string | null;
      personagem_id: string | null;
      vida_maxima: number;
      vida_atual: number;
      ca_atual: number;
      iniciativa: number | null;
      ordem_vez: number;
      status: string;
      statusEffects: {
        id: string;
        nome_efeito: string;
        tipo: string;
        duracao_rodadas: number | null;
      }[];
      player: { imagem_id: string | null } | null;
      character: { imagem_id: string | null } | null;
    },
  ): CombatParticipantResponseDto {
    const source = this.mapTipoToSource(participant.tipo_participante);
    const imagemId = participant.player?.imagem_id ?? participant.character?.imagem_id ?? undefined;

    return {
      id: participant.id,
      nome: participant.nome_combate,
      source,
      sourceId: participant.jogador_id ?? participant.personagem_id ?? undefined,
      imagem: imagemId,
      vidaMaxima: participant.vida_maxima,
      vidaAtual: participant.vida_atual,
      ca: participant.ca_atual,
      iniciativa: participant.iniciativa,
      ordemVez: participant.ordem_vez,
      status: participant.status as CombatParticipantResponseDto['status'],
      buffs: participant.statusEffects
        .filter(effect => effect.tipo === 'BUFF')
        .map(effect => this.toEffectResponse(effect)),
      debuffs: participant.statusEffects
        .filter(effect => effect.tipo === 'DEBUFF')
        .map(effect => this.toEffectResponse(effect)),
    };
  }

  private toEffectResponse(effect: {
    id: string;
    nome_efeito: string;
    tipo: string;
    duracao_rodadas: number | null;
  }): CombatStatusEffectResponseDto {
    return {
      id: effect.id,
      nome: effect.nome_efeito,
      tipo: effect.tipo as CombatStatusEffectResponseDto['tipo'],
      duracaoRodadas: effect.duracao_rodadas ?? undefined,
    };
  }

  private mapTipoToSource(tipo: string): FighterSourceDto {
    switch (tipo) {
      case 'JOGADOR':
        return FighterSourceDto.HERO;
      case 'NPC':
        return FighterSourceDto.NPC;
      case 'MOB':
        return FighterSourceDto.MOB;
      default:
        return FighterSourceDto.CUSTOM;
    }
  }
}
