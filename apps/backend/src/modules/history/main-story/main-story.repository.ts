import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { MainStory } from './entities/main-story.entity';
import { MainStoryRequestDto, MainStoryUpdateDto } from './dto/main-story-request.dto';

@Injectable()
export class MainStoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCampaign(campanha_id: string): Promise<MainStory[]> {
    return this.prisma.mainStory.findMany({
      where: { campanha_id },
      orderBy: { ordem: 'asc' },
    });
  }

  async findById(id: string): Promise<MainStory | null> {
    return this.prisma.mainStory.findUnique({
      where: { id },
    });
  }

  async create(data: MainStoryRequestDto): Promise<MainStory> {
    return this.prisma.mainStory.create({
      data: {
        campanha_id: data.campanha_id,
        titulo: data.titulo,
        conteudo: data.conteudo,
        ordem: data.ordem ?? 1,
      },
    });
  }

  async update(id: string, data: MainStoryUpdateDto): Promise<MainStory> {
    return this.prisma.mainStory.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<MainStory> {
    return this.prisma.mainStory.delete({
      where: { id },
    });
  }
}
