import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BestiaryEntry } from './entities/bestiary.entity';
import { BestiaryRequestDto, BestiaryUpdateDto } from './dto/bestiary-request.dto';

@Injectable()
export class BestiaryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCampaign(campanha_id: string): Promise<BestiaryEntry[]> {
    return this.prisma.character.findMany({
      where: { campanha_id },
      orderBy: { nome: 'asc' },
    });
  }

  async findById(id: string): Promise<BestiaryEntry | null> {
    return this.prisma.character.findUnique({ where: { id } });
  }

  async create(data: BestiaryRequestDto): Promise<BestiaryEntry> {
    return this.prisma.character.create({ data });
  }

  async update(id: string, data: BestiaryUpdateDto): Promise<BestiaryEntry> {
    return this.prisma.character.update({ where: { id }, data });
  }

  async delete(id: string): Promise<BestiaryEntry> {
    return this.prisma.character.delete({ where: { id } });
  }
}
