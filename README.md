# RPG Manager

Ferramenta web para mestres de RPG organizarem campanhas, histórias, grimório (NPCs/Mobs), heróis e combates — com editor rich text, áudio ambiente e upload de imagens.

## Stack

| Camada    | Tecnologias                          |
|-----------|--------------------------------------|
| Frontend  | React, TypeScript, Vite, Tailwind CSS, TipTap |
| Backend   | NestJS, Prisma, PostgreSQL (Neon)  |
| Monorepo  | npm workspaces                       |

## Pré-requisitos

- Node.js 18+
- npm 9+
- Conta no [Neon](https://neon.tech) (PostgreSQL gerenciado — usado em dev e produção)

## Estrutura do projeto

```
meu-projeto-monorepo/
├── apps/
│   ├── backend/          # API NestJS + Prisma
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/   # versionado no Git
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

### 2. Banco de dados (Neon)

O projeto usa **Neon** tanto no desenvolvimento quanto em produção — não é necessário PostgreSQL local.

```bash
cp apps/backend/.env-exemple apps/backend/.env
```

No painel do Neon, copie as duas URLs de conexão para `apps/backend/.env`:

| Variável       | Onde pegar no Neon      | Uso                          |
|----------------|-------------------------|------------------------------|
| `DATABASE_URL` | Pooled connection       | API em runtime (`backend:dev`) |
| `DIRECT_URL`   | Direct connection       | Prisma Migrate               |

```env
DATABASE_URL="postgresql://usuario:senha@host-pooler.regiao.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://usuario:senha@host.regiao.aws.neon.tech/neondb?sslmode=require"
PORT=3001
```

> **Dica:** o host do pooler contém `-pooler`; o direto é o mesmo host **sem** `-pooler`.

### 3. Migrations do Prisma

As migrations em `apps/backend/prisma/migrations/` **devem ficar no Git** — são o histórico do schema compartilhado entre o time.

**Primeira vez ou após `git pull`** (fluxo normal no dev com Neon):

```bash
npm run db:setup
```

Isso aplica migrations pendentes (`migrate deploy`) e regenera o Prisma Client.

**Ao criar uma migration nova** (alterou `schema.prisma`):

```bash
npm run db:migrate:dev
```

> Com Neon, use `db:migrate` / `db:setup` no dia a dia. Reserve `db:migrate:dev` só para quando você está **escrevendo** uma migration nova.

> **Nota:** não adicione `prisma/migrations/` ao `.gitignore`. Apenas arquivos locais como `.env` devem ser ignorados.

### 4. Frontend

```bash
cp apps/frontend/.env.example apps/frontend/.env
```

Conteúdo padrão:

```env
VITE_API_URL=http://localhost:3001
```

> **Imagens:** heróis e personagens do grimório são armazenados na tabela `images` do PostgreSQL (BYTEA). Qualquer PC conectado ao mesmo banco Neon vê as mesmas imagens via `GET /image/:id`.

## Executar em desenvolvimento

Garanta que o `.env` do backend aponta para o Neon e que as migrations estão aplicadas:

```bash
npm run db:setup   # só na primeira vez ou após git pull
```

Em dois terminais:

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
npm run backend:dev      # API com hot-reload (recompila ao salvar)
npm run backend:build    # Build do backend
npm run frontend:dev     # Frontend em modo dev
npm run frontend:build   # Build de produção do frontend
npm run db:setup         # migrate deploy + generate (dev/prod Neon)
npm run db:migrate       # aplicar migrations pendentes
npm run db:migrate:dev   # criar migration nova (schema.prisma alterado)
npm run db:generate      # regenerar Prisma Client
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

## Licença

Projeto privado.
