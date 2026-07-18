import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageService } from '../image/image.service';
import { MapsRepository } from './maps.repository';
import { MapRequestDto, MapUpdateDto } from './dto/map-request.dto';
import { MapResponseDto } from './dto/map-response.dto';

@Injectable()
export class MapsService {
  constructor(
    private readonly repository: MapsRepository,
    private readonly imageService: ImageService,
  ) {}

  async findByCampaign(campanha_id: string): Promise<MapResponseDto[]> {
    return this.repository.findByCampaign(campanha_id);
  }

  async findById(id: string): Promise<MapResponseDto> {
    const entry = await this.repository.findById(id);
    if (!entry) {
      throw new NotFoundException('Mapa não encontrado');
    }
    return entry;
  }

  async create(data: MapRequestDto): Promise<MapResponseDto> {
    return this.repository.create(data);
  }

  async update(id: string, data: MapUpdateDto): Promise<MapResponseDto> {
    const current = await this.findById(id);
    const updated = await this.repository.update(id, data);

    if (current.imagem_id && current.imagem_id !== updated.imagem_id) {
      await this.imageService.delete(current.imagem_id);
    }

    return updated;
  }

  async delete(id: string): Promise<MapResponseDto> {
    const entry = await this.findById(id);
    const imagemId = entry.imagem_id;
    await this.repository.delete(id);
    await this.imageService.delete(imagemId);
    return entry;
  }
}
