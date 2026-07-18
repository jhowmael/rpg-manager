-- AlterTable
ALTER TABLE "characters" ADD COLUMN IF NOT EXISTS "atributos" JSONB;
ALTER TABLE "characters" ADD COLUMN IF NOT EXISTS "habilidades" JSONB;

-- AlterTable
ALTER TABLE "combat_participants" ADD COLUMN IF NOT EXISTS "atributos" JSONB;
ALTER TABLE "combat_participants" ADD COLUMN IF NOT EXISTS "habilidades" JSONB;
