import { Module } from '@nestjs/common';
import { ImageModule } from '../image/image.module';
import { MapsController } from './maps.controller';
import { MapsService } from './maps.service';
import { MapsRepository } from './maps.repository';

@Module({
  imports: [ImageModule],
  controllers: [MapsController],
  providers: [MapsService, MapsRepository],
  exports: [MapsService, MapsRepository],
})
export class MapsModule {}
