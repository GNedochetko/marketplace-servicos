# Marketplace de Servicos

Plataforma web para conectar clientes e prestadores de servicos locais. O projeto implementa uma API REST com cadastro/login, perfis de prestadores, ofertas de servico, solicitacoes e avaliacoes.

## Tecnologias

Backend:

```txt
Node.js
TypeScript
Express
TypeORM
PostgreSQL
JWT
bcryptjs
Celebrate/Joi
Docker
```

Frontend:

```txt
Vue 3
Vite
TypeScript
```

## Estrutura

```txt
src/
  modules/
    auth/
    users/
    categories/
    providers/
    service-offers/
    requests/
    reviews/
  shared/
    http/
    routes/
    typeorm/

frontend/
docs/
  api.md
```

## Requisitos

Para rodar com Docker:

```txt
Docker
Docker Compose
```

Para rodar localmente sem Docker:

```txt
Node.js
npm
PostgreSQL
```

## Configuracao De Ambiente

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Variaveis principais:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5434
DB_USER=postgres
DB_PASSWORD=docker
DB_NAME=api-marketplace-services

JWT_SECRET=change_me_to_a_long_random_secret
```

## Rodando Com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

Servicos:

```txt
Backend:  http://localhost:5000
Frontend: http://localhost:8080
Postgres: localhost:5434
```

Para parar:

```bash
docker compose down
```

Para apagar o banco local e recriar tudo do zero:

```bash
docker compose down -v
docker compose up --build
```

## Rodando Localmente

Instale as dependencias do backend:

```bash
npm install
```

Instale as dependencias do frontend:

```bash
cd frontend
npm install
cd ..
```

Suba o banco com Docker:

```bash
docker compose up db
```

Rode as migrations:

```bash
npm run migration:run
```

Inicie o backend:

```bash
npm run dev
```

Inicie o frontend:

```bash
cd frontend
npm run dev
```

## Comandos Uteis

Gerar migration:

```bash
npm run migration:generate -- src/shared/typeorm/migrations/NomeDaMigration
```

Rodar migrations:

```bash
npm run migration:run
```

Checar TypeScript:

```bash
npx tsc --noEmit
```

## Autenticacao

O login retorna um token JWT:

```txt
POST /sessions
```

Rotas protegidas precisam do header:

```txt
Authorization: Bearer TOKEN_AQUI
```

As senhas sao armazenadas com hash usando `bcryptjs`.

## Modulos Da API

```txt
auth             login/autenticacao
users            usuarios clientes/prestadores
categories       categorias de servico
providers        perfis profissionais dos prestadores
service-offers   servicos oferecidos
requests         solicitacoes de servico
reviews          avaliacoes de 1 a 5 estrelas
```

## Documentacao Da API

A documentacao completa dos endpoints esta em:

```txt
docs/api.md
```

Ela inclui:

```txt
rotas
autenticacao
bodies esperados
respostas
erros comuns
fluxo completo de teste no Insomnia
```

## Fluxo Basico Do Sistema

```txt
1. Criar usuario cliente
2. Criar usuario prestador
3. Fazer login
4. Criar perfil de prestador
5. Criar categoria
6. Criar oferta de servico
7. Cliente solicita servico
8. Prestador atualiza status da solicitacao
9. Cliente avalia o prestador
```