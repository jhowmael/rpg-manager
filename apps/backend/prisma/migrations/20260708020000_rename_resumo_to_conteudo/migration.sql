-- RenameColumn
ALTER TABLE "main_stories" RENAME COLUMN "resumo" TO "conteudo";

-- RenameColumn
ALTER TABLE "side_quests" RENAME COLUMN "resumo" TO "conteudo";

-- AlterTable
ALTER TABLE "side_quests" ALTER COLUMN "conteudo" SET DEFAULT '';
