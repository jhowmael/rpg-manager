import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageService } from '../image/image.service';
import { HeroRepository } from './hero.repository';
import { HeroRequestDto, HeroUpdateDto } from './dto/hero-request.dto';
import { HeroResponseDto } from './dto/hero-response.dto';

@Injectable()
export class HeroService {
  constructor(
    private readonly repository: HeroRepository,
    private readonly imageService: ImageService,
  ) {}

  async findByCampaign(campanha_id: string): Promise<HeroResponseDto[]> {
    return this.repository.findByCampaign(campanha_id);
  }

  async findById(id: string): Promise<HeroResponseDto> {
    const hero = await this.repository.findById(id);
    if (!hero) {
      throw new NotFoundException('Herói não encontrado');
    }
    return hero;
  }

  async create(data: HeroRequestDto): Promise<HeroResponseDto> {
    return this.repository.create(data);
  }

  async update(id: string, data: HeroUpdateDto): Promise<HeroResponseDto> {
    const current = await this.findById(id);
    const updated = await this.repository.update(id, data);

    if (current.imagem_id && current.imagem_id !== updated.imagem_id) {
      await this.imageService.delete(current.imagem_id);
    }

    return updated;
  }

  async delete(id: string): Promise<HeroResponseDto> {
    const hero = await this.findById(id);
    const imagemId = hero.imagem_id;
    await this.repository.delete(id);
    await this.imageService.delete(imagemId);
    return hero;
  }
}
