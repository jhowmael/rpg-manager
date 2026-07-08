-- DropTable (cleanup legacy)
DROP TABLE IF EXISTS "SideQuest" CASCADE;
DROP TABLE IF EXISTS "Campaign" CASCADE;

-- CreateTable
CREATE TABLE "campanha" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "sistema_rpg" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jogador" (
    "id" TEXT NOT NULL,
    "campanha_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "raca" TEXT,
    "classe" TEXT,

    CONSTRAINT "jogador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historia_principal" (
    "id" TEXT NOT NULL,
    "campanha_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumo" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "historia_principal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sidequest" (
    "id" TEXT NOT NULL,
    "campanha_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INATIVA',

    CONSTRAINT "sidequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mapa_sidequest" (
    "id" TEXT NOT NULL,
    "sidequest_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "url_mapa" TEXT NOT NULL,

    CONSTRAINT "mapa_sidequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personagem" (
    "id" TEXT NOT NULL,
    "campanha_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "historia" TEXT,
    "o_que_sabe" TEXT,
    "personalidade" TEXT,
    "familia_relacoes" TEXT,

    CONSTRAINT "personagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sidequest_personagem" (
    "sidequest_id" TEXT NOT NULL,
    "personagem_id" TEXT NOT NULL,

    CONSTRAINT "sidequest_personagem_pkey" PRIMARY KEY ("sidequest_id","personagem_id")
);

-- CreateTable
CREATE TABLE "combate" (
    "id" TEXT NOT NULL,
    "campanha_id" TEXT NOT NULL,
    "nome_encontro" TEXT NOT NULL,
    "em_andamento" BOOLEAN NOT NULL DEFAULT false,
    "tempo_turno_minutos" INTEGER NOT NULL DEFAULT 5,
    "rodada_atual" INTEGER NOT NULL DEFAULT 1,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "combate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combate_participante" (
    "id" TEXT NOT NULL,
    "combate_id" TEXT NOT NULL,
    "jogador_id" TEXT,
    "personagem_id" TEXT,
    "nome_combate" TEXT NOT NULL,
    "tipo_participante" TEXT NOT NULL,
    "vida_atual" INTEGER NOT NULL,
    "ca_atual" INTEGER NOT NULL,
    "iniciativa" INTEGER NOT NULL DEFAULT 0,
    "ordem_vez" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "combate_participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combate_status_efeito" (
    "id" TEXT NOT NULL,
    "participante_id" TEXT NOT NULL,
    "nome_efeito" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "duracao_rodadas" INTEGER,
    "ativo" BOOLEAN,

    CONSTRAINT "combate_status_efeito_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "jogador" ADD CONSTRAINT "jogador_campanha_id_fkey" FOREIGN KEY ("campanha_id") REFERENCES "campanha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historia_principal" ADD CONSTRAINT "historia_principal_campanha_id_fkey" FOREIGN KEY ("campanha_id") REFERENCES "campanha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sidequest" ADD CONSTRAINT "sidequest_campanha_id_fkey" FOREIGN KEY ("campanha_id") REFERENCES "campanha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mapa_sidequest" ADD CONSTRAINT "mapa_sidequest_sidequest_id_fkey" FOREIGN KEY ("sidequest_id") REFERENCES "sidequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personagem" ADD CONSTRAINT "personagem_campanha_id_fkey" FOREIGN KEY ("campanha_id") REFERENCES "campanha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sidequest_personagem" ADD CONSTRAINT "sidequest_personagem_sidequest_id_fkey" FOREIGN KEY ("sidequest_id") REFERENCES "sidequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sidequest_personagem" ADD CONSTRAINT "sidequest_personagem_personagem_id_fkey" FOREIGN KEY ("personagem_id") REFERENCES "personagem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combate" ADD CONSTRAINT "combate_campanha_id_fkey" FOREIGN KEY ("campanha_id") REFERENCES "campanha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combate_participante" ADD CONSTRAINT "combate_participante_combate_id_fkey" FOREIGN KEY ("combate_id") REFERENCES "combate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combate_participante" ADD CONSTRAINT "combate_participante_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combate_participante" ADD CONSTRAINT "combate_participante_personagem_id_fkey" FOREIGN KEY ("personagem_id") REFERENCES "personagem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combate_status_efeito" ADD CONSTRAINT "combate_status_efeito_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "combate_participante"("id") ON DELETE CASCADE ON UPDATE CASCADE;
