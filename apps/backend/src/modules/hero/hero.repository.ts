import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Hero } from './entities/hero.entity';
import { HeroRequestDto, HeroUpdateDto } from './dto/hero-request.dto';

@Injectable()
export class HeroRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCampaign(campanha_id: string): Promise<Hero[]> {
    return this.prisma.player.findMany({
      where: { campanha_id },
      orderBy: { nome: 'asc' },
    });
  }

  async findById(id: string): Promise<Hero | null> {
    return this.prisma.player.findUnique({ where: { id } });
  }

  async create(data: HeroRequestDto): Promise<Hero> {
    return this.prisma.player.create({ data });
  }

  async update(id: string, data: HeroUpdateDto): Promise<Hero> {
    return this.prisma.player.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Hero> {
    return this.prisma.player.delete({ where: { id } });
  }
}
