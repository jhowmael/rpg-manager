import { ApiProperty } from '@nestjs/swagger';

export class ImageUploadResponseDto {
  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'UUID da imagem no banco de dados',
  })
  id: string;

  @ApiProperty({ example: '/image/f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  url: string;
}
