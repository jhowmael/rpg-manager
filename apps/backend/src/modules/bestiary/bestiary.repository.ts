import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BestiaryEntry } from './entities/bestiary.entity';
import { BestiaryRequestDto, BestiaryUpdateDto } from './dto/bestiary-request.dto';

@Injectable()
export class BestiaryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findByCampaign(campanha_id: string): Promise<BestiaryEntry[]> {
		const rows = await this.prisma.character.findMany({
			where: { campanha_id },
			orderBy: { nome: 'asc' },
		});
		return rows.map(row => this.toEntry(row));
	}

	async findById(id: string): Promise<BestiaryEntry | null> {
		const row = await this.prisma.character.findUnique({ where: { id } });
		return row ? this.toEntry(row) : null;
	}

	async create(data: BestiaryRequestDto): Promise<BestiaryEntry> {
		const row = await this.prisma.character.create({
			data: {
				campanha_id: data.campanha_id,
				nome: data.nome,
				titulo: data.titulo,
				raca: data.raca,
				classe: data.classe,
				tipo: data.tipo,
				imagem_id: data.imagem_id,
				historia: data.historia,
				caracteristicas: data.caracteristicas,
				o_que_sabe: data.o_que_sabe,
				personalidade: data.personalidade ?? [],
				familia_relacoes: data.familia_relacoes,
				atributos: data.atributos
					? (data.atributos as unknown as Prisma.InputJsonValue)
					: Prisma.JsonNull,
				habilidades: data.habilidades
					? (data.habilidades as unknown as Prisma.InputJsonValue)
					: Prisma.JsonNull,
			},
		});
		return this.toEntry(row);
	}

	async update(id: string, data: BestiaryUpdateDto): Promise<BestiaryEntry> {
		const updateData: Prisma.CharacterUncheckedUpdateInput = {};

		if (data.nome !== undefined) updateData.nome = data.nome;
		if (data.titulo !== undefined) updateData.titulo = data.titulo;
		if (data.raca !== undefined) updateData.raca = data.raca;
		if (data.classe !== undefined) updateData.classe = data.classe;
		if (data.tipo !== undefined) updateData.tipo = data.tipo;
		if (data.imagem_id !== undefined) updateData.imagem_id = data.imagem_id;
		if (data.historia !== undefined) updateData.historia = data.historia;
		if (data.caracteristicas !== undefined) {
			updateData.caracteristicas = data.caracteristicas;
		}
		if (data.o_que_sabe !== undefined) updateData.o_que_sabe = data.o_que_sabe;
		if (data.personalidade !== undefined) {
			updateData.personalidade = data.personalidade;
		}
		if (data.familia_relacoes !== undefined) {
			updateData.familia_relacoes = data.familia_relacoes;
		}
		if (data.atributos !== undefined) {
			updateData.atributos = data.atributos as unknown as Prisma.InputJsonValue;
		}
		if (data.habilidades !== undefined) {
			updateData.habilidades =
				data.habilidades as unknown as Prisma.InputJsonValue;
		}

		const row = await this.prisma.character.update({
			where: { id },
			data: updateData,
		});
		return this.toEntry(row);
	}

	async delete(id: string): Promise<BestiaryEntry> {
		const row = await this.prisma.character.delete({ where: { id } });
		return this.toEntry(row);
	}

	private toEntry(row: {
		id: string;
		campanha_id: string;
		nome: string;
		titulo: string | null;
		raca: string | null;
		classe: string | null;
		tipo: string;
		historia: string | null;
		caracteristicas: string | null;
		o_que_sabe: string | null;
		personalidade: string[];
		familia_relacoes: string | null;
		imagem_id: string | null;
		atributos: Prisma.JsonValue;
		habilidades: Prisma.JsonValue;
	}): BestiaryEntry {
		return {
			id: row.id,
			campanha_id: row.campanha_id,
			nome: row.nome,
			titulo: row.titulo ?? undefined,
			raca: row.raca ?? undefined,
			classe: row.classe ?? undefined,
			tipo: row.tipo,
			historia: row.historia ?? undefined,
			caracteristicas: row.caracteristicas ?? undefined,
			o_que_sabe: row.o_que_sabe ?? undefined,
			personalidade: row.personalidade,
			familia_relacoes: row.familia_relacoes ?? undefined,
			imagem_id: row.imagem_id ?? undefined,
			atributos: (row.atributos as Record<string, number> | null) ?? undefined,
			habilidades:
				(row.habilidades as Array<{
					id?: string;
					nome: string;
					descricao?: string;
				}> | null) ?? undefined,
		};
	}
}
