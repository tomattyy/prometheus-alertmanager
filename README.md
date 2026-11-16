# API CRUD com Service Layer Pattern + PostgreSQL + Prometheus & Alertmanager

API RESTful desenvolvida em **Node.js + TypeScript + Express + PostgreSQL (`pg`)** seguindo a arquitetura em camadas **Controller -> Service -> Repository (Service Pattern)**, instrumentada com **Prometheus** (`prom-client`) e **Alertmanager**.

## Estrutura de Pastas

```text
├── Dockerfile                     # Imagem Docker da API Node.js
├── docker-compose.yml             # Containers: PostgreSQL, API, Prometheus e Alertmanager
├── monitoring/
│   ├── prometheus/
│   │   ├── prometheus.yml         # Configuração de scrape (api:3000) e Alertmanager
│   │   └── alert.rules.yml        # Regras de alerta (ApiDown, HighHttpErrorRate, Latência, Memória)
│   └── alertmanager/
│       └── alertmanager.yml       # Roteamento de alertas e Webhook Receiver
├── sql/
│   └── init.sql                   # Script SQL inicial da tabela users
└── src/
    ├── config/
    │   └── database.ts            # Pool de conexão com o PostgreSQL
    ├── models/
    │   └── user.model.ts          # Interfaces e DTOs (User, CreateUserDTO, UpdateUserDTO)
    ├── repositories/
    │   └── user.repository.ts     # Camada de acesso a dados (queries SQL)
    ├── services/
    │   └── user.service.ts        # Camada de regras de negócio e validações
    ├── controllers/
    │   └── user.controller.ts     # Camada HTTP (Request / Response)
    ├── routes/
    │   └── user.routes.ts         # Definição das rotas Express
    ├── middlewares/
    │   ├── error.middleware.ts    # Tratamento centralizado de erros (AppError)
    │   └── metrics.middleware.ts  # Coleta de métricas HTTP e endpoint /metrics
    ├── app.ts                     # Configuração do Express + rotas de métricas e webhook
    └── server.ts                  # Inicialização do servidor e banco
```

## Como Executar (Tudo via Docker Compose)

Suba o **PostgreSQL**, a **API**, o **Prometheus** e o **Alertmanager** com um único comando:

```bash
docker compose up -d --build
```
*(ou `npm run docker:up`)*

Para parar todos os containers:
```bash
docker compose down
```

### Alternativa: Rodar a API fora do Docker (Local)
Caso queira rodar apenas o banco no Docker e a API no terminal local:
```bash
npm install
docker compose up -d postgres prometheus alertmanager
npm run dev
```

## Serviços e Interfaces Web

| Serviço | URL | Descrição |
| :--- | :--- | :--- |
| **API Node.js** | `http://localhost:3000` | Servidor principal da API |
| **Métricas da API** | `http://localhost:3000/metrics` | Endpoint exposto para o Prometheus |
| **Prometheus UI** | `http://localhost:9090` | Consulta de métricas (PromQL), Targets e Alerts |
| **Alertmanager UI** | `http://localhost:9093` | Gerenciamento de alertas ativos e silenciamentos |
