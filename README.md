# RPG Manager

Ferramenta web para mestres de RPG organizarem campanhas, histórias, grimório (NPCs/Mobs), heróis e combates — com editor rich text, áudio ambiente e upload de imagens.

## Stack

| Camada    | Tecnologias                          |
|-----------|--------------------------------------|
| Frontend  | React, TypeScript, Vite, Tailwind CSS, TipTap |
| Backend   | NestJS, Prisma, PostgreSQL           |
| Monorepo  | npm workspaces                       |

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm 9+

## Estrutura do projeto

```
meu-projeto-monorepo/
├── apps/
│   ├── backend/          # API NestJS + Prisma
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/   # versionado no Git
│   │   └── uploads/            # imagens enviadas (ignorado no Git)
│   └── frontend/         # App React (Vite)
├── package.json
└── README.md
```

## Configuração

### 1. Instalar dependências

Na raiz do monorepo:

```bash
npm install
```

### 2. Banco de dados

Crie um banco PostgreSQL (ex.: `rpg_manager`) e configure o backend:

```bash
cp apps/backend/.env-exemple apps/backend/.env
```

Edite `apps/backend/.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/rpg_manager?schema=public"
PORT=3001
```

### 3. Migrations do Prisma

As migrations em `apps/backend/prisma/migrations/` **devem ficar no Git** — são o histórico do schema compartilhado entre o time.

```bash
# Aplicar migrations e gerar o client
cd apps/backend
npx prisma migrate dev
npx prisma generate
```

Em produção ou CI:

```bash
cd apps/backend
npx prisma migrate deploy
```

> **Nota:** não adicione `prisma/migrations/` ao `.gitignore`. Apenas arquivos locais como `.env` e `uploads/` devem ser ignorados.

### 4. Frontend

```bash
cp apps/frontend/.env.example apps/frontend/.env
```

Conteúdo padrão:

```env
VITE_API_URL=http://localhost:3001
```

## Executar em desenvolvimento

Na raiz do monorepo, em dois terminais:

```bash
# Terminal 1 — API
npm run backend:dev

# Terminal 2 — Frontend
npm run frontend:dev
```

| Serviço   | URL                              |
|-----------|----------------------------------|
| Frontend  | http://localhost:5173            |
| Backend   | http://localhost:3001            |
| Swagger   | http://localhost:3001/api/docs |

## Scripts úteis

```bash
npm run backend:dev      # API em modo watch
npm run backend:build    # Build do backend
npm run frontend:dev     # Frontend em modo dev
npm run frontend:build   # Build de produção do frontend
npm run db:migrate       # prisma migrate dev (workspace backend)
```

## Módulos da aplicação

- **Campanhas** — criar e selecionar campanhas
- **História** — capítulos principais e side quests com editor rich text
- **Grimório** — cadastro de NPCs e Mobs
- **Heróis** — fichas de jogadores
- **Combate** — iniciativa, HP e efeitos de status

## Arquivos ignorados pelo Git

- `.env` e variantes locais (use `.env.example` / `.env-exemple` como modelo)
- `node_modules/`
- `dist/` e builds
- `apps/backend/uploads/` (imagens enviadas pelos usuários)

## Licença

Projeto privado.
