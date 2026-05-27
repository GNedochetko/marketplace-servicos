# Documentacao da API

API REST da Plataforma de Servicos Locais, um marketplace que conecta clientes e prestadores de servicos.

## Base URL

Ambiente local:

```txt
http://localhost:5000
```

## Autenticacao

A API usa JWT para proteger rotas que alteram dados.

Fluxo:

```txt
1. Criar usuario em POST /users
2. Fazer login em POST /sessions
3. Copiar o token retornado
4. Enviar o token nas rotas protegidas
```

Header para rotas protegidas:

```txt
Authorization: Bearer TOKEN_AQUI
```

Rotas publicas principais:

```txt
POST /users
POST /sessions
GET /categories
GET /providers
GET /service-offers
GET /reviews/provider/:provider_id
```

Rotas que criam ou alteram dados, em geral, exigem autenticacao.

## Formato De Erro

Erros de regra de negocio retornam um objeto neste formato:

```json
{
  "status": "error",
  "message": "Mensagem do erro"
}
```

Erros de validacao do Celebrate/Joi retornam detalhes da validacao da requisicao.

## Health Check

### GET /

Verifica se a API esta respondendo.

Autenticacao: nao requerida.

Resposta 200:

```json
{
  "message": "Hello Dev!"
}
```

## Auth / Sessions

### POST /sessions

Realiza login e retorna um token JWT.

Autenticacao: nao requerida.

Body:

```json
{
  "email": "maria@email.com",
  "password": "123456"
}
```

Resposta 200:

```json
{
  "user": {
    "id": "uuid",
    "name": "Maria Cliente",
    "email": "maria@email.com",
    "role": "client",
    "created_at": "2026-05-27T10:00:00.000Z",
    "updated_at": "2026-05-27T10:00:00.000Z"
  },
  "token": "jwt"
}
```

Erros comuns:

```txt
400 - erro de validacao
401 - Incorrect email/password combination
```

## Users

Tipos de usuario:

```txt
client
provider
```

### POST /users

Cria um usuario.

Autenticacao: nao requerida.

Body:

```json
{
  "name": "Maria Cliente",
  "email": "maria@email.com",
  "password": "123456",
  "role": "client"
}
```

Observacoes:

```txt
role e opcional; se nao for enviado, o padrao e client.
password deve ter pelo menos 6 caracteres.
a senha e salva no banco com hash.
```

Resposta 201:

```json
{
  "id": "uuid",
  "name": "Maria Cliente",
  "email": "maria@email.com",
  "role": "client",
  "created_at": "2026-05-27T10:00:00.000Z",
  "updated_at": "2026-05-27T10:00:00.000Z"
}
```

Erros comuns:

```txt
400 - Email already exists
400 - erro de validacao
```

### GET /users

Lista usuarios.

Autenticacao: nao requerida.

Resposta 200:

```json
[
  {
    "id": "uuid",
    "name": "Maria Cliente",
    "email": "maria@email.com",
    "role": "client",
    "created_at": "2026-05-27T10:00:00.000Z",
    "updated_at": "2026-05-27T10:00:00.000Z"
  }
]
```

### GET /users/:id

Busca um usuario pelo id.

Autenticacao: nao requerida.

Params:

```txt
id: UUID
```

Resposta 200:

```json
{
  "id": "uuid",
  "name": "Maria Cliente",
  "email": "maria@email.com",
  "role": "client",
  "created_at": "2026-05-27T10:00:00.000Z",
  "updated_at": "2026-05-27T10:00:00.000Z"
}
```

Erros comuns:

```txt
400 - erro de validacao
404 - User not found
```

### PUT /users/:id

Atualiza um usuario.

Autenticacao: requerida.

Headers:

```txt
Authorization: Bearer TOKEN_AQUI
```

Params:

```txt
id: UUID
```

Body:

```json
{
  "name": "Maria Atualizada",
  "email": "maria.novo@email.com",
  "password": "654321",
  "role": "client"
}
```

Todos os campos do body sao opcionais.

Resposta 200:

```json
{
  "id": "uuid",
  "name": "Maria Atualizada",
  "email": "maria.novo@email.com",
  "role": "client",
  "created_at": "2026-05-27T10:00:00.000Z",
  "updated_at": "2026-05-27T11:00:00.000Z"
}
```

Erros comuns:

```txt
400 - Email already exists
400 - erro de validacao
401 - JWT token is missing
401 - Invalid JWT token
404 - User not found
```

## Categories

### POST /categories

Cria uma categoria de servico.

Autenticacao: requerida.

Headers:

```txt
Authorization: Bearer TOKEN_AQUI
```

Body:

```json
{
  "name": "Eletricista",
  "description": "Servicos eletricos residenciais e comerciais"
}
```

Resposta 201:

```json
{
  "id": "uuid",
  "name": "Eletricista",
  "description": "Servicos eletricos residenciais e comerciais",
  "created_at": "2026-05-27T10:00:00.000Z",
  "updated_at": "2026-05-27T10:00:00.000Z"
}
```

Erros comuns:

```txt
400 - Category already exists
400 - erro de validacao
401 - JWT token is missing
401 - Invalid JWT token
```

### GET /categories

Lista categorias.

Autenticacao: nao requerida.

Resposta 200:

```json
[
  {
    "id": "uuid",
    "name": "Eletricista",
    "description": "Servicos eletricos residenciais e comerciais",
    "created_at": "2026-05-27T10:00:00.000Z",
    "updated_at": "2026-05-27T10:00:00.000Z"
  }
]
```

### GET /categories/:id

Busca uma categoria pelo id.

Autenticacao: nao requerida.

Params:

```txt
id: UUID
```

Resposta 200:

```json
{
  "id": "uuid",
  "name": "Eletricista",
  "description": "Servicos eletricos residenciais e comerciais",
  "created_at": "2026-05-27T10:00:00.000Z",
  "updated_at": "2026-05-27T10:00:00.000Z"
}
```

Erros comuns:

```txt
400 - erro de validacao
404 - Category not found
```

### PUT /categories/:id

Atualiza uma categoria.

Autenticacao: requerida.

Headers:

```txt
Authorization: Bearer TOKEN_AQUI
```

Params:

```txt
id: UUID
```

Body:

```json
{
  "name": "Eletricista Residencial",
  "description": "Servicos eletricos para residencias"
}
```

Todos os campos do body sao opcionais.

Resposta 200:

```json
{
  "id": "uuid",
  "name": "Eletricista Residencial",
  "description": "Servicos eletricos para residencias",
  "created_at": "2026-05-27T10:00:00.000Z",
  "updated_at": "2026-05-27T11:00:00.000Z"
}
```

Erros comuns:

```txt
400 - Category already exists
400 - erro de validacao
401 - JWT token is missing
401 - Invalid JWT token
404 - Category not found
```

## Providers

### POST /providers

Cria o perfil profissional de um usuario prestador.

Autenticacao: requerida.

Regras:

```txt
user_id deve existir.
o usuario precisa ter role = provider.
um usuario pode ter apenas um perfil de prestador.
```

Headers:

```txt
Authorization: Bearer TOKEN_AQUI
```

Body:

```json
{
  "user_id": "uuid",
  "bio": "Eletricista residencial com 5 anos de experiencia.",
  "phone": "(42) 99999-9999",
  "availability": "Segunda a sexta, das 08h as 18h"
}
```

Resposta 201:

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "bio": "Eletricista residencial com 5 anos de experiencia.",
  "phone": "(42) 99999-9999",
  "availability": "Segunda a sexta, das 08h as 18h",
  "created_at": "2026-05-27T10:00:00.000Z",
  "updated_at": "2026-05-27T10:00:00.000Z"
}
```

Erros comuns:

```txt
400 - User must have provider role
400 - Provider profile already exists for this user
400 - erro de validacao
401 - JWT token is missing
401 - Invalid JWT token
404 - User not found
```

### GET /providers

Lista prestadores.

Autenticacao: nao requerida.

Resposta 200:

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "bio": "Eletricista residencial com 5 anos de experiencia.",
    "phone": "(42) 99999-9999",
    "availability": "Segunda a sexta",
    "user": {
      "id": "uuid",
      "name": "Joao Prestador",
      "email": "joao@email.com",
      "role": "provider"
    }
  }
]
```

### GET /providers/:id

Busca um prestador pelo id.

Autenticacao: nao requerida.

Params:

```txt
id: UUID
```

Resposta 200:

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "bio": "Eletricista residencial com 5 anos de experiencia.",
  "phone": "(42) 99999-9999",
  "availability": "Segunda a sexta",
  "user": {
    "id": "uuid",
    "name": "Joao Prestador",
    "email": "joao@email.com",
    "role": "provider"
  },
  "service_offers": []
}
```

Erros comuns:

```txt
400 - erro de validacao
404 - Provider not found
```

### PUT /providers/:id

Atualiza um prestador.

Autenticacao: requerida.

Headers:

```txt
Authorization: Bearer TOKEN_AQUI
```

Params:

```txt
id: UUID
```

Body:

```json
{
  "bio": "Eletricista atualizado.",
  "phone": "(42) 98888-8888",
  "availability": "Segunda a sabado"
}
```

Todos os campos do body sao opcionais. Tambem e possivel enviar `user_id`, desde que o novo usuario exista, tenha `role = provider` e ainda nao tenha perfil de prestador.

Resposta 200:

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "bio": "Eletricista atualizado.",
  "phone": "(42) 98888-8888",
  "availability": "Segunda a sabado",
  "created_at": "2026-05-27T10:00:00.000Z",
  "updated_at": "2026-05-27T11:00:00.000Z"
}
```

Erros comuns:

```txt
400 - User must have provider role
400 - Provider profile already exists for this user
400 - erro de validacao
401 - JWT token is missing
401 - Invalid JWT token
404 - Provider not found
404 - User not found
```

## Service Offers

### POST /service-offers

Cria uma oferta de servico de um prestador.

Autenticacao: requerida.

Regras:

```txt
provider_id deve existir.
category_id deve existir.
price deve ser positivo.
```

Headers:

```txt
Authorization: Bearer TOKEN_AQUI
```

Body:

```json
{
  "provider_id": "uuid",
  "category_id": "uuid",
  "title": "Instalacao de tomadas",
  "description": "Instalacao e troca de tomadas residenciais.",
  "price": 120,
  "availability": "Segunda a sexta a tarde"
}
```

Resposta 201:

```json
{
  "id": "uuid",
  "provider_id": "uuid",
  "category_id": "uuid",
  "title": "Instalacao de tomadas",
  "description": "Instalacao e troca de tomadas residenciais.",
  "price": "120.00",
  "availability": "Segunda a sexta a tarde",
  "created_at": "2026-05-27T10:00:00.000Z",
  "updated_at": "2026-05-27T10:00:00.000Z"
}
```

Erros comuns:

```txt
400 - erro de validacao
401 - JWT token is missing
401 - Invalid JWT token
404 - Provider not found
404 - Category not found
```

### GET /service-offers

Lista ofertas de servico.

Autenticacao: nao requerida.

Resposta 200:

```json
[
  {
    "id": "uuid",
    "provider_id": "uuid",
    "category_id": "uuid",
    "title": "Instalacao de tomadas",
    "description": "Instalacao e troca de tomadas residenciais.",
    "price": "120.00",
    "availability": "Segunda a sexta a tarde",
    "provider": {},
    "category": {}
  }
]
```

### GET /service-offers/:id

Busca uma oferta de servico pelo id.

Autenticacao: nao requerida.

Params:

```txt
id: UUID
```

Resposta 200:

```json
{
  "id": "uuid",
  "provider_id": "uuid",
  "category_id": "uuid",
  "title": "Instalacao de tomadas",
  "description": "Instalacao e troca de tomadas residenciais.",
  "price": "120.00",
  "availability": "Segunda a sexta a tarde",
  "provider": {},
  "category": {}
}
```

Erros comuns:

```txt
400 - erro de validacao
404 - Service offer not found
```

### PUT /service-offers/:id

Atualiza uma oferta de servico.

Autenticacao: requerida.

Headers:

```txt
Authorization: Bearer TOKEN_AQUI
```

Params:

```txt
id: UUID
```

Body:

```json
{
  "title": "Instalacao de tomadas e interruptores",
  "description": "Servico atualizado.",
  "price": 150,
  "availability": "Segunda a sabado"
}
```

Todos os campos do body sao opcionais. Tambem e possivel enviar `provider_id` e `category_id`, desde que existam.

Resposta 200:

```json
{
  "id": "uuid",
  "provider_id": "uuid",
  "category_id": "uuid",
  "title": "Instalacao de tomadas e interruptores",
  "description": "Servico atualizado.",
  "price": 150,
  "availability": "Segunda a sabado",
  "created_at": "2026-05-27T10:00:00.000Z",
  "updated_at": "2026-05-27T11:00:00.000Z"
}
```

Erros comuns:

```txt
400 - erro de validacao
401 - JWT token is missing
401 - Invalid JWT token
404 - Service offer not found
404 - Provider not found
404 - Category not found
```

## Requests

Status possiveis:

```txt
pending
accepted
completed
canceled
```

### POST /requests

Cria uma solicitacao de servico.

Autenticacao: requerida.

Regras:

```txt
client_id deve existir e ter role = client.
provider_id deve existir.
service_offer_id deve existir.
a oferta deve pertencer ao provider_id informado.
status inicial e pending.
```

Headers:

```txt
Authorization: Bearer TOKEN_AQUI
```

Body:

```json
{
  "client_id": "uuid",
  "provider_id": "uuid",
  "service_offer_id": "uuid",
  "notes": "Preciso trocar duas tomadas na cozinha."
}
```

Resposta 201:

```json
{
  "id": "uuid",
  "client_id": "uuid",
  "provider_id": "uuid",
  "service_offer_id": "uuid",
  "status": "pending",
  "notes": "Preciso trocar duas tomadas na cozinha.",
  "created_at": "2026-05-27T10:00:00.000Z",
  "updated_at": "2026-05-27T10:00:00.000Z"
}
```

Erros comuns:

```txt
400 - User must have client role
400 - Service offer does not belong to this provider
400 - erro de validacao
401 - JWT token is missing
401 - Invalid JWT token
404 - Client not found
404 - Provider not found
404 - Service offer not found
```

### GET /requests

Lista solicitacoes.

Autenticacao: nao requerida.

Resposta 200:

```json
[
  {
    "id": "uuid",
    "client_id": "uuid",
    "provider_id": "uuid",
    "service_offer_id": "uuid",
    "status": "pending",
    "notes": "Preciso trocar duas tomadas na cozinha.",
    "client": {},
    "provider": {},
    "service_offer": {}
  }
]
```

### GET /requests/:id

Busca uma solicitacao pelo id.

Autenticacao: nao requerida.

Params:

```txt
id: UUID
```

Resposta 200:

```json
{
  "id": "uuid",
  "client_id": "uuid",
  "provider_id": "uuid",
  "service_offer_id": "uuid",
  "status": "pending",
  "notes": "Preciso trocar duas tomadas na cozinha.",
  "client": {},
  "provider": {},
  "service_offer": {},
  "review": null
}
```

Erros comuns:

```txt
400 - erro de validacao
404 - Request not found
```

### PUT /requests/:id/status

Atualiza o status de uma solicitacao.

Autenticacao: requerida.

Headers:

```txt
Authorization: Bearer TOKEN_AQUI
```

Params:

```txt
id: UUID
```

Body:

```json
{
  "status": "completed"
}
```

Resposta 200:

```json
{
  "id": "uuid",
  "client_id": "uuid",
  "provider_id": "uuid",
  "service_offer_id": "uuid",
  "status": "completed",
  "notes": "Preciso trocar duas tomadas na cozinha.",
  "created_at": "2026-05-27T10:00:00.000Z",
  "updated_at": "2026-05-27T11:00:00.000Z"
}
```

Erros comuns:

```txt
400 - erro de validacao
401 - JWT token is missing
401 - Invalid JWT token
404 - Request not found
```

## Reviews

### POST /reviews

Cria uma avaliacao para uma solicitacao concluida.

Autenticacao: requerida.

Regras:

```txt
rating deve estar entre 1 e 5.
request_id deve existir.
a request precisa estar completed.
client_id deve ser o cliente da request.
provider_id deve ser o prestador da request.
uma request pode ter apenas uma review.
```

Headers:

```txt
Authorization: Bearer TOKEN_AQUI
```

Body:

```json
{
  "request_id": "uuid",
  "client_id": "uuid",
  "provider_id": "uuid",
  "rating": 5,
  "comment": "Servico excelente, rapido e bem feito."
}
```

Resposta 201:

```json
{
  "id": "uuid",
  "request_id": "uuid",
  "client_id": "uuid",
  "provider_id": "uuid",
  "rating": 5,
  "comment": "Servico excelente, rapido e bem feito.",
  "created_at": "2026-05-27T10:00:00.000Z",
  "updated_at": "2026-05-27T10:00:00.000Z"
}
```

Erros comuns:

```txt
400 - Rating must be between 1 and 5
400 - Only completed requests can be reviewed
400 - Client does not match request
400 - Provider does not match request
400 - Request already has a review
400 - erro de validacao
401 - JWT token is missing
401 - Invalid JWT token
404 - Request not found
```

### GET /reviews/provider/:provider_id

Lista avaliacoes de um prestador. Essa rota deve ser usada pelo frontend para exibir avaliacoes no perfil do prestador.

Autenticacao: nao requerida.

Params:

```txt
provider_id: UUID
```

Resposta 200:

```json
[
  {
    "id": "uuid",
    "request_id": "uuid",
    "client_id": "uuid",
    "provider_id": "uuid",
    "rating": 5,
    "comment": "Servico excelente, rapido e bem feito.",
    "client": {},
    "request": {}
  }
]
```

Erros comuns:

```txt
400 - erro de validacao
404 - Provider not found
```

## Fluxo De Teste Completo

Use este fluxo no Insomnia para validar o backend:

### 1. Criar usuario cliente

```txt
POST /users
```

```json
{
  "name": "Maria Cliente",
  "email": "maria@email.com",
  "password": "123456",
  "role": "client"
}
```

Guarde o `id` como `client_id`.

### 2. Criar usuario prestador

```txt
POST /users
```

```json
{
  "name": "Joao Prestador",
  "email": "joao@email.com",
  "password": "123456",
  "role": "provider"
}
```

Guarde o `id` como `provider_user_id`.

### 3. Fazer login

```txt
POST /sessions
```

```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

Guarde o `token` e envie nas proximas rotas protegidas:

```txt
Authorization: Bearer TOKEN_AQUI
```

### 4. Criar perfil de prestador

```txt
POST /providers
```

```json
{
  "user_id": "provider_user_id",
  "bio": "Eletricista residencial com 5 anos de experiencia.",
  "phone": "(42) 99999-9999",
  "availability": "Segunda a sexta, das 08h as 18h"
}
```

Guarde o `id` como `provider_id`.

### 5. Criar categoria

```txt
POST /categories
```

```json
{
  "name": "Eletricista",
  "description": "Servicos eletricos residenciais e comerciais"
}
```

Guarde o `id` como `category_id`.

### 6. Criar oferta de servico

```txt
POST /service-offers
```

```json
{
  "provider_id": "provider_id",
  "category_id": "category_id",
  "title": "Instalacao de tomadas",
  "description": "Instalacao e troca de tomadas residenciais.",
  "price": 120,
  "availability": "Segunda a sexta a tarde"
}
```

Guarde o `id` como `service_offer_id`.

### 7. Criar solicitacao

Se estiver logado com o prestador, voce pode continuar usando o mesmo token porque o backend atual exige apenas autenticacao. Em um controle de permissao mais avancado, o ideal seria logar como cliente para criar request.

```txt
POST /requests
```

```json
{
  "client_id": "client_id",
  "provider_id": "provider_id",
  "service_offer_id": "service_offer_id",
  "notes": "Preciso trocar duas tomadas na cozinha."
}
```

Guarde o `id` como `request_id`.

### 8. Aceitar solicitacao

```txt
PUT /requests/request_id/status
```

```json
{
  "status": "accepted"
}
```

### 9. Concluir solicitacao

```txt
PUT /requests/request_id/status
```

```json
{
  "status": "completed"
}
```

### 10. Criar avaliacao

```txt
POST /reviews
```

```json
{
  "request_id": "request_id",
  "client_id": "client_id",
  "provider_id": "provider_id",
  "rating": 5,
  "comment": "Servico excelente, rapido e bem feito."
}
```

### 11. Listar avaliacoes do prestador

```txt
GET /reviews/provider/provider_id
```

## Observacoes De Seguranca

O backend atualmente possui:

```txt
hash de senha com bcryptjs
JWT no login
middleware de autenticacao
validacao de entrada com Joi/Celebrate
remocao do campo password das respostas de users/auth
```

Para producao, a API deve ser publicada com HTTPS e `JWT_SECRET` forte configurado por variavel de ambiente.