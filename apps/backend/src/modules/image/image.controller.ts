import {
  Controller,
  Get,
  Header,
  Param,
  ParseUUIDPipe,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ImageService } from './image.service';
import { ImageUploadResponseDto } from './dto/image-upload-response.dto';

@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar imagem' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @ApiCreatedResponse({ type: ImageUploadResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    return this.imageService.upload(file);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar imagem por ID' })
  @ApiParam({ name: 'id', description: 'UUID da imagem' })
  @ApiOkResponse({ description: 'Binário da imagem' })
  @ApiNotFoundResponse()
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StreamableFile> {
    const image = await this.imageService.findById(id);
    return new StreamableFile(image.data, {
      type: image.mime_type,
      disposition: 'inline',
    });
  }
}
