import { Module } from '@nestjs/common';
import { ImageModule } from '../image/image.module';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';
import { HeroRepository } from './hero.repository';

@Module({
  imports: [ImageModule],
  controllers: [HeroController],
  providers: [HeroService, HeroRepository],
  exports: [HeroService, HeroRepository],
})
export class HeroModule {}
