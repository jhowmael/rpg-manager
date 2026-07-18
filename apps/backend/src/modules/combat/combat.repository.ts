import { Injectable } from '@nestjs/common';
import {
  CombatParticipant,
  CombatStatusEffect,
  Combat as PrismaCombat,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CombatRequestDto, CombatUpdateDto } from './dto/combat-request.dto';
import {
  CombatParticipantRequestDto,
  FighterSourceDto,
} from './dto/combat-participant-request.dto';
import { CombatStatusEffectRequestDto } from './dto/combat-status-effect-request.dto';

type CombatWithRelations = PrismaCombat & {
  participants: (CombatParticipant & {
    statusEffects: CombatStatusEffect[];
    player: { imagem_id: string | null } | null;
    character: { imagem_id: string | null } | null;
  })[];
};

const combatInclude = {
  participants: {
    include: {
      statusEffects: true,
      player: { select: { imagem_id: true } },
      character: { select: { imagem_id: true } },
    },
    orderBy: { ordem_vez: 'asc' as const },
  },
} satisfies Prisma.CombatInclude;

@Injectable()
export class CombatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCampaign(campanha_id: string): Promise<CombatWithRelations[]> {
    return this.prisma.combat.findMany({
      where: { campanha_id },
      include: combatInclude,
      orderBy: { criado_em: 'desc' },
    });
  }

  async findById(id: string): Promise<CombatWithRelations | null> {
    return this.prisma.combat.findUnique({
      where: { id },
      include: combatInclude,
    });
  }

  async create(data: CombatRequestDto): Promise<CombatWithRelations> {
    return this.prisma.combat.create({
      data: this.buildCreateData(data),
      include: combatInclude,
    });
  }

  async update(id: string, data: CombatUpdateDto): Promise<CombatWithRelations> {
    return this.prisma.$transaction(async tx => {
      if (data.fighters !== undefined) {
        await tx.combatStatusEffect.deleteMany({
          where: { participant: { combate_id: id } },
        });
        await tx.combatParticipant.deleteMany({ where: { combate_id: id } });
      }

      return tx.combat.update({
        where: { id },
        data: this.buildUpdateData(data),
        include: combatInclude,
      });
    });
  }

  async delete(id: string): Promise<CombatWithRelations> {
    return this.prisma.combat.delete({
      where: { id },
      include: combatInclude,
    });
  }

  private buildCreateData(data: CombatRequestDto): Prisma.CombatUncheckedCreateInput {
    const fase = data.fase ?? 'setup';

    return {
      campanha_id: data.campanha_id,
      nome_encontro: data.nome?.trim() || 'Novo combate',
      tempo_turno_minutos: data.tempo_turno_minutos ?? 5,
      fase,
      em_andamento: fase === 'battle',
      rodada_atual: data.rodada_atual ?? 1,
      turno_atual_index: data.turno_atual_index ?? 0,
      turno_iniciado_em:
        data.turno_iniciado_em != null ? new Date(data.turno_iniciado_em) : null,
      encerrado_em: data.encerrado_em ? new Date(data.encerrado_em) : null,
      participants: data.fighters?.length
        ? {
            create: data.fighters.map(fighter => this.mapFighterCreate(fighter)),
          }
        : undefined,
    };
  }

  private buildUpdateData(data: CombatUpdateDto): Prisma.CombatUpdateInput {
    const fase = data.fase;
    const update: Prisma.CombatUpdateInput = {};

    if (data.nome !== undefined) update.nome_encontro = data.nome;
    if (data.tempo_turno_minutos !== undefined) {
      update.tempo_turno_minutos = data.tempo_turno_minutos;
    }
    if (fase !== undefined) {
      update.fase = fase;
      update.em_andamento = fase === 'battle';
    }
    if (data.rodada_atual !== undefined) update.rodada_atual = data.rodada_atual;
    if (data.turno_atual_index !== undefined) {
      update.turno_atual_index = data.turno_atual_index;
    }
    if (data.turno_iniciado_em !== undefined) {
      update.turno_iniciado_em =
        data.turno_iniciado_em != null ? new Date(data.turno_iniciado_em) : null;
    }
    if (data.encerrado_em !== undefined) {
      update.encerrado_em = data.encerrado_em ? new Date(data.encerrado_em) : null;
    }
    if (data.fighters) {
      update.participants = {
        create: data.fighters.map(fighter => this.mapFighterCreate(fighter)),
      };
    }

    return update;
  }

  private mapFighterCreate(
    fighter: CombatParticipantRequestDto,
  ): Prisma.CombatParticipantUncheckedCreateWithoutCombatInput {
    const { jogador_id, personagem_id, tipo_participante } = this.mapSource(fighter);

    return {
      id: fighter.id,
      nome_combate: fighter.nome,
      tipo_participante,
      jogador_id,
      personagem_id,
      vida_maxima: fighter.vidaMaxima,
      vida_atual: fighter.vidaAtual,
      ca_atual: fighter.ca,
      iniciativa: fighter.iniciativa ?? null,
      ordem_vez: fighter.ordemVez,
      status: fighter.status,
      ativo: fighter.status === 'active',
      atributos: fighter.atributos ?? undefined,
      habilidades: fighter.habilidades ?? undefined,
      statusEffects: {
        create: [
          ...(fighter.buffs ?? []).map(effect => this.mapEffectCreate(effect, 'BUFF')),
          ...(fighter.debuffs ?? []).map(effect => this.mapEffectCreate(effect, 'DEBUFF')),
        ],
      },
    };
  }

  private mapSource(fighter: CombatParticipantRequestDto) {
    switch (fighter.source) {
      case FighterSourceDto.HERO:
        return {
          jogador_id: fighter.sourceId ?? null,
          personagem_id: null,
          tipo_participante: 'JOGADOR',
        };
      case FighterSourceDto.NPC:
        return {
          jogador_id: null,
          personagem_id: fighter.sourceId ?? null,
          tipo_participante: 'NPC',
        };
      case FighterSourceDto.MOB:
        return {
          jogador_id: null,
          personagem_id: fighter.sourceId ?? null,
          tipo_participante: 'MOB',
        };
      default:
        return {
          jogador_id: null,
          personagem_id: null,
          tipo_participante: 'CUSTOM',
        };
    }
  }

  private mapEffectCreate(
    effect: CombatStatusEffectRequestDto,
    tipo: 'BUFF' | 'DEBUFF',
  ): Prisma.CombatStatusEffectUncheckedCreateWithoutParticipantInput {
    return {
      id: effect.id,
      nome_efeito: effect.nome,
      tipo,
      duracao_rodadas: effect.duracaoRodadas ?? null,
      ativo: true,
    };
  }
}
