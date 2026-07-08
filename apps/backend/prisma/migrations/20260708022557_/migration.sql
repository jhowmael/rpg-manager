-- AlterTable
ALTER TABLE "campaigns" RENAME CONSTRAINT "campanha_pkey" TO "campaigns_pkey";

-- AlterTable
ALTER TABLE "characters" RENAME CONSTRAINT "personagem_pkey" TO "characters_pkey";

-- AlterTable
ALTER TABLE "combat_participants" RENAME CONSTRAINT "combate_participante_pkey" TO "combat_participants_pkey";

-- AlterTable
ALTER TABLE "combat_status_effects" RENAME CONSTRAINT "combate_status_efeito_pkey" TO "combat_status_effects_pkey";

-- AlterTable
ALTER TABLE "combats" RENAME CONSTRAINT "combate_pkey" TO "combats_pkey";

-- AlterTable
ALTER TABLE "main_stories" RENAME CONSTRAINT "historia_principal_pkey" TO "main_stories_pkey";

-- AlterTable
ALTER TABLE "players" RENAME CONSTRAINT "jogador_pkey" TO "players_pkey";

-- AlterTable
ALTER TABLE "side_quest_characters" RENAME CONSTRAINT "sidequest_personagem_pkey" TO "side_quest_characters_pkey";

-- AlterTable
ALTER TABLE "side_quest_maps" RENAME CONSTRAINT "mapa_sidequest_pkey" TO "side_quest_maps_pkey";

-- AlterTable
ALTER TABLE "side_quests" RENAME CONSTRAINT "sidequest_pkey" TO "side_quests_pkey";

-- RenameForeignKey
ALTER TABLE "characters" RENAME CONSTRAINT "personagem_campanha_id_fkey" TO "characters_campanha_id_fkey";

-- RenameForeignKey
ALTER TABLE "combat_participants" RENAME CONSTRAINT "combate_participante_combate_id_fkey" TO "combat_participants_combate_id_fkey";

-- RenameForeignKey
ALTER TABLE "combat_participants" RENAME CONSTRAINT "combate_participante_jogador_id_fkey" TO "combat_participants_jogador_id_fkey";

-- RenameForeignKey
ALTER TABLE "combat_participants" RENAME CONSTRAINT "combate_participante_personagem_id_fkey" TO "combat_participants_personagem_id_fkey";

-- RenameForeignKey
ALTER TABLE "combat_status_effects" RENAME CONSTRAINT "combate_status_efeito_participante_id_fkey" TO "combat_status_effects_participante_id_fkey";

-- RenameForeignKey
ALTER TABLE "combats" RENAME CONSTRAINT "combate_campanha_id_fkey" TO "combats_campanha_id_fkey";

-- RenameForeignKey
ALTER TABLE "main_stories" RENAME CONSTRAINT "historia_principal_campanha_id_fkey" TO "main_stories_campanha_id_fkey";

-- RenameForeignKey
ALTER TABLE "players" RENAME CONSTRAINT "jogador_campanha_id_fkey" TO "players_campanha_id_fkey";

-- RenameForeignKey
ALTER TABLE "side_quest_characters" RENAME CONSTRAINT "sidequest_personagem_personagem_id_fkey" TO "side_quest_characters_personagem_id_fkey";

-- RenameForeignKey
ALTER TABLE "side_quest_characters" RENAME CONSTRAINT "sidequest_personagem_sidequest_id_fkey" TO "side_quest_characters_sidequest_id_fkey";

-- RenameForeignKey
ALTER TABLE "side_quest_maps" RENAME CONSTRAINT "mapa_sidequest_sidequest_id_fkey" TO "side_quest_maps_sidequest_id_fkey";

-- RenameForeignKey
ALTER TABLE "side_quests" RENAME CONSTRAINT "sidequest_campanha_id_fkey" TO "side_quests_campanha_id_fkey";
