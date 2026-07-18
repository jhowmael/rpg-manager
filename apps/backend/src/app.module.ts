import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CampaignModule } from './modules/campaign/campaign.module';
import { HeroModule } from './modules/hero/hero.module';
import { MainStoryModule } from './modules/history/main-story/main-story.module';
import { SideQuestModule } from './modules/history/side-quest/side-quest.module';
import { BestiaryModule } from './modules/bestiary/bestiary.module';
import { MapsModule } from './modules/maps/maps.module';
import { CombatModule } from './modules/combat/combat.module';
import { ImageModule } from './modules/image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CampaignModule,
    HeroModule,
    MainStoryModule,
    SideQuestModule,
    BestiaryModule,
    MapsModule,
    CombatModule,
    ImageModule,
  ],
})
export class AppModule {}
