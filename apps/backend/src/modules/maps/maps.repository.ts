import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CampaignMapEntry } from './entities/map.entity';
import { MapRequestDto, MapUpdateDto } from './dto/map-request.dto';

@Injectable()
export class MapsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCampaign(campanha_id: string): Promise<CampaignMapEntry[]> {
    return this.prisma.campaignMap.findMany({
      where: { campanha_id },
      orderBy: { nome: 'asc' },
    });
  }

  async findById(id: string): Promise<CampaignMapEntry | null> {
    return this.prisma.campaignMap.findUnique({ where: { id } });
  }

  async create(data: MapRequestDto): Promise<CampaignMapEntry> {
    return this.prisma.campaignMap.create({ data });
  }

  async update(id: string, data: MapUpdateDto): Promise<CampaignMapEntry> {
    return this.prisma.campaignMap.update({ where: { id }, data });
  }

  async delete(id: string): Promise<CampaignMapEntry> {
    return this.prisma.campaignMap.delete({ where: { id } });
  }
}
