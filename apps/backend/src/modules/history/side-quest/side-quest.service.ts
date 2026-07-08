import { Injectable, NotFoundException } from '@nestjs/common';
import { SideQuestRepository } from './side-quest.repository';
import { SideQuestRequestDto, SideQuestUpdateDto } from './dto/side-quest-request.dto';
import { SideQuestResponseDto } from './dto/side-quest-response.dto';

@Injectable()
export class SideQuestService {
  constructor(private readonly repository: SideQuestRepository) {}

  async findByCampaign(campanha_id: string): Promise<SideQuestResponseDto[]> {
    return this.repository.findByCampaign(campanha_id);
  }

  async findById(id: string): Promise<SideQuestResponseDto> {
    const sideQuest = await this.repository.findById(id);

    if (!sideQuest) {
      throw new NotFoundException('Side quest não encontrada');
    }

    return sideQuest;
  }

  async create(data: SideQuestRequestDto): Promise<SideQuestResponseDto> {
    return this.repository.create(data);
  }

  async update(id: string, data: SideQuestUpdateDto): Promise<SideQuestResponseDto> {
    await this.findById(id);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<SideQuestResponseDto> {
    await this.findById(id);
    return this.repository.delete(id);
  }
}
