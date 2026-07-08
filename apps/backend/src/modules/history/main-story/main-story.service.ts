import { Injectable, NotFoundException } from '@nestjs/common';
import { MainStoryRepository } from './main-story.repository';
import { MainStoryRequestDto, MainStoryUpdateDto } from './dto/main-story-request.dto';
import { MainStoryResponseDto } from './dto/main-story-response.dto';

@Injectable()
export class MainStoryService {
  constructor(private readonly repository: MainStoryRepository) {}

  async findByCampaign(campanha_id: string): Promise<MainStoryResponseDto[]> {
    return this.repository.findByCampaign(campanha_id);
  }

  async findById(id: string): Promise<MainStoryResponseDto> {
    const story = await this.repository.findById(id);

    if (!story) {
      throw new NotFoundException('Capítulo não encontrado');
    }

    return story;
  }

  async create(data: MainStoryRequestDto): Promise<MainStoryResponseDto> {
    return this.repository.create(data);
  }

  async update(id: string, data: MainStoryUpdateDto): Promise<MainStoryResponseDto> {
    await this.findById(id);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<MainStoryResponseDto> {
    await this.findById(id);
    return this.repository.delete(id);
  }
}
