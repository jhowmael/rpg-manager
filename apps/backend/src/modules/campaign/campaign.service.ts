import { Injectable, NotFoundException } from '@nestjs/common';
import { CampaignRepository } from './campaign.repository';
import { CampaignRequestDto, CampaignUpdateDto } from './dto/campaign-request.dto';
import { CampaignResponseDto } from './dto/campaign-response.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async create(data: CampaignRequestDto): Promise<CampaignResponseDto> {
    return this.campaignRepository.create(data);
  }

  async findAll(): Promise<CampaignResponseDto[]> {
    return this.campaignRepository.findAll();
  }

  async findById(id: string): Promise<CampaignResponseDto> {
    const campaign = await this.campaignRepository.findById(id);

    if (!campaign) {
      throw new NotFoundException('Campanha não encontrada');
    }

    return campaign;
  }

  async update(id: string, data: CampaignUpdateDto): Promise<CampaignResponseDto> {
    await this.findById(id);
    return this.campaignRepository.update(id, data);
  }

  async delete(id: string): Promise<CampaignResponseDto> {
    await this.findById(id);
    return this.campaignRepository.delete(id);
  }
}
