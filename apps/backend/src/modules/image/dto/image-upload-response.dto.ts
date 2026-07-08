import { ApiProperty } from '@nestjs/swagger';

export class ImageUploadResponseDto {
  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479.webp',
    description: 'Nome do arquivo salvo (id da imagem + extensão)',
  })
  id: string;

  @ApiProperty({ example: '/uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479.webp' })
  url: string;
}
