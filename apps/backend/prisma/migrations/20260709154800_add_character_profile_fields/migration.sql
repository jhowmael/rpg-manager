-- AlterTable: novos campos e personalidade como array
ALTER TABLE "characters" ADD COLUMN "titulo" TEXT;
ALTER TABLE "characters" ADD COLUMN "raca" TEXT;
ALTER TABLE "characters" ADD COLUMN "classe" TEXT;
ALTER TABLE "characters" ADD COLUMN "caracteristicas" TEXT;

ALTER TABLE "characters" ADD COLUMN "personalidade_new" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "characters"
SET "personalidade_new" = ARRAY["personalidade"]
WHERE "personalidade" IS NOT NULL AND TRIM("personalidade") <> '';

ALTER TABLE "characters" DROP COLUMN "personalidade";
ALTER TABLE "characters" RENAME COLUMN "personalidade_new" TO "personalidade";
