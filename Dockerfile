# Stage 1: Dependências
FROM node:24-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node package*.json ./
COPY --chown=node:node src ./src

USER node

EXPOSE 3000

HEALTHCHECK --interval= 30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('https://127.0.0.1:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "src/server.ts"]