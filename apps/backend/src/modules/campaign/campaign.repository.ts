import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Campaign } from './entities/campaign.entity';
import { CampaignRequestDto, CampaignUpdateDto } from './dto/campaign-request.dto';

@Injectable()
export class CampaignRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CampaignRequestDto): Promise<Campaign> {
    return this.prisma.campaign.create({
      data,
    });
  }

  async findAll(): Promise<Campaign[]> {
    return this.prisma.campaign.findMany({
      orderBy: {
        criado_em: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Campaign | null> {
    return this.prisma.campaign.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: CampaignUpdateDto): Promise<Campaign> {
    return this.prisma.campaign.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Campaign> {
    return this.prisma.campaign.delete({
      where: { id },
    });
  }
}
