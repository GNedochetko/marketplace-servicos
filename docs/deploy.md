# Deploy com Docker Compose

O arquivo `docker-compose.deploy.yml` executa a demonstracao com:

- frontend compilado servido por Nginx nao-root;
- API acessivel somente pelo proxy interno em `/api`;
- PostgreSQL e backend sem portas publicadas;
- frontend publicado somente em `127.0.0.1:8080`;
- limites de CPU, memoria, processos e logs;
- containers sem bind mounts do codigo;
- backend e frontend com filesystem somente leitura;
- `no-new-privileges` e capabilities removidas onde compativel.

## Subir

Crie o arquivo de variaveis:

```bash
cp .env.deploy.example .env.deploy
```

Troque `DB_PASSWORD` e `JWT_SECRET`, depois execute:

```bash
docker compose --env-file .env.deploy -f docker-compose.deploy.yml up -d --build
```

Verifique:

```bash
docker compose --env-file .env.deploy -f docker-compose.deploy.yml ps
docker stats
curl http://127.0.0.1:8080/api/
```

Para atualizar:

```bash
git pull
docker compose --env-file .env.deploy -f docker-compose.deploy.yml up -d --build
```

Para parar sem apagar o banco:

```bash
docker compose --env-file .env.deploy -f docker-compose.deploy.yml down
```

## Nginx externo

O Nginx da VM deve encaminhar o dominio inteiro para o frontend interno. Um exemplo para
`/etc/nginx/conf.d/marketplace.conf`:

```nginx
limit_req_zone $binary_remote_addr zone=marketplace_rate:10m rate=10r/s;
limit_conn_zone $binary_remote_addr zone=marketplace_conn:10m;

server {
    listen 80;
    server_name exemplo.seudominio.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name exemplo.seudominio.com;

    # Configure aqui ssl_certificate e ssl_certificate_key.

    limit_req zone=marketplace_rate burst=30 nodelay;
    limit_conn marketplace_conn 20;
    client_max_body_size 64k;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 5s;
        proxy_read_timeout 30s;
    }
}
```

Mantenha o firewall da VM liberando externamente apenas `80` e `443`. A porta configurada
em `APP_PORT` fica vinculada ao loopback e nao deve ser publicada externamente.

### OpenResty ou Nginx Proxy Manager em container

Se o proxy reverso tambem estiver em um container, ele nao consegue acessar uma porta
publicada somente em `127.0.0.1` da VM. Alem disso, `127.0.0.1` dentro do OpenResty aponta
para o proprio container do proxy.

Nesse caso, configure no `.env.deploy`:

```env
APP_BIND_ADDRESS=0.0.0.0
APP_PORT=8080
```

Recrie o frontend:

```bash
docker compose --env-file .env.deploy -f docker-compose.deploy.yml up -d --build frontend
```

No OpenResty/Nginx Proxy Manager, encaminhe para o IP privado da VM na porta `8080`, nunca
para `127.0.0.1` ou `localhost`. Mantenha a porta `8080` bloqueada externamente pelo
firewall da VM, liberando somente `80` e `443`.

## Limites configurados

| Servico | CPU | Memoria maxima | Reserva | PIDs |
| --- | ---: | ---: | ---: | ---: |
| frontend | 0.50 | 128 MB | 32 MB | 50 |
| backend | 1.00 | 384 MB | 96 MB | 100 |
| PostgreSQL | 0.75 | 512 MB | 128 MB | 150 |

Esses valores sao apropriados para uma demonstracao pequena. Ajuste `cpus`, `mem_limit`,
`mem_reservation` e `pids_limit` no Compose se a VM tiver poucos recursos ou se houver
mais acessos.

## Isolamento da rede

A rede do banco e interna ao Docker. A rede entre frontend e backend precisa aceitar a
conexao do proxy reverso, portanto nao pode ser marcada como `internal`.

Se movimento lateral for uma preocupacao mesmo dentro da VM dedicada, aplique regras de
firewall de saida na VM para bloquear acesso aos CIDRs privados e administrativos da
infraestrutura. O Compose sozinho nao substitui esse controle de rede do host.
