import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SideQuest } from './entities/side-quest.entity';
import { SideQuestRequestDto, SideQuestUpdateDto } from './dto/side-quest-request.dto';

@Injectable()
export class SideQuestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCampaign(campanha_id: string): Promise<SideQuest[]> {
    return this.prisma.sideQuest.findMany({
      where: { campanha_id },
      orderBy: { titulo: 'asc' },
    });
  }

  async findById(id: string): Promise<SideQuest | null> {
    return this.prisma.sideQuest.findUnique({
      where: { id },
    });
  }

  async create(data: SideQuestRequestDto): Promise<SideQuest> {
    return this.prisma.sideQuest.create({
      data: {
        campanha_id: data.campanha_id,
        titulo: data.titulo,
        conteudo: data.conteudo,
        status: data.status ?? 'INATIVA',
      },
    });
  }

  async update(id: string, data: SideQuestUpdateDto): Promise<SideQuest> {
    return this.prisma.sideQuest.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<SideQuest> {
    return this.prisma.sideQuest.delete({
      where: { id },
    });
  }
}
