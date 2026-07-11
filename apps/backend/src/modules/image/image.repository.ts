import { Injectable } from '@nestjs/common';
import { Image } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Buffer,
    mime_type: string,
    tamanho: number,
  ): Promise<Image> {
    return this.prisma.image.create({
      data: {
        data,
        mime_type,
        tamanho,
      },
    });
  }

  async findById(id: string): Promise<Image | null> {
    return this.prisma.image.findUnique({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.image.delete({ where: { id } });
    } catch {
      // Imagem já removida ou inexistente
    }
  }
}
