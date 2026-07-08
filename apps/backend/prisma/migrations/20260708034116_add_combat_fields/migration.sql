-- AlterTable
ALTER TABLE "combat_participants" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "vida_maxima" INTEGER NOT NULL DEFAULT 20,
ALTER COLUMN "iniciativa" DROP NOT NULL,
ALTER COLUMN "iniciativa" DROP DEFAULT;

-- AlterTable
ALTER TABLE "combats" ADD COLUMN     "encerrado_em" TIMESTAMP(3),
ADD COLUMN     "fase" TEXT NOT NULL DEFAULT 'setup',
ADD COLUMN     "turno_atual_index" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "turno_iniciado_em" TIMESTAMP(3);
