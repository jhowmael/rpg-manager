-- CreateTable
CREATE TABLE "campaign_maps" (
    "id" TEXT NOT NULL,
    "campanha_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "imagem_id" TEXT,

    CONSTRAINT "campaign_maps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "campaign_maps" ADD CONSTRAINT "campaign_maps_campanha_id_fkey" FOREIGN KEY ("campanha_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_maps" ADD CONSTRAINT "campaign_maps_imagem_id_fkey" FOREIGN KEY ("imagem_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
