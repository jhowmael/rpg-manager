-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "mime_type" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- Referências antigas apontavam para arquivos locais (uploads/), não existem no banco
UPDATE "players" SET "imagem_id" = NULL WHERE "imagem_id" IS NOT NULL;
UPDATE "characters" SET "imagem_id" = NULL WHERE "imagem_id" IS NOT NULL;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_imagem_id_fkey" FOREIGN KEY ("imagem_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_imagem_id_fkey" FOREIGN KEY ("imagem_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
