import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageService } from '../image/image.service';
import { BestiaryRepository } from './bestiary.repository';
import { BestiaryRequestDto, BestiaryUpdateDto } from './dto/bestiary-request.dto';
import { BestiaryResponseDto } from './dto/bestiary-response.dto';

@Injectable()
export class BestiaryService {
  constructor(
    private readonly repository: BestiaryRepository,
    private readonly imageService: ImageService,
  ) {}

  async findByCampaign(campanha_id: string): Promise<BestiaryResponseDto[]> {
    return this.repository.findByCampaign(campanha_id);
  }

  async findById(id: string): Promise<BestiaryResponseDto> {
    const entry = await this.repository.findById(id);
    if (!entry) {
      throw new NotFoundException('Entrada do grimório não encontrada');
    }
    return entry;
  }

  async create(data: BestiaryRequestDto): Promise<BestiaryResponseDto> {
    return this.repository.create(data);
  }

  async update(id: string, data: BestiaryUpdateDto): Promise<BestiaryResponseDto> {
    const current = await this.findById(id);
    const updated = await this.repository.update(id, data);

    if (current.imagem_id && current.imagem_id !== updated.imagem_id) {
      await this.imageService.delete(current.imagem_id);
    }

    return updated;
  }

  async delete(id: string): Promise<BestiaryResponseDto> {
    const entry = await this.findById(id);
    const imagemId = entry.imagem_id;
    await this.repository.delete(id);
    await this.imageService.delete(imagemId);
    return entry;
  }
}
