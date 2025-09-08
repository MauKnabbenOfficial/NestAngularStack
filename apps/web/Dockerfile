# ---- deps de produção (cacheável) ----
FROM node:22.16.0-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Para front não precisamos de deps em runtime, matendo a etapa por padronização
RUN npm ci --omit=dev

# ---- builder (gera dist) ----
FROM node:22.16.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
# copia todo o código
COPY . .
# build de produção (usa o Angular CLI do projeto)
RUN npx ng build --configuration=production

# ---- runtime (leve) ----
FROM node:22.16.0-alpine AS prod
WORKDIR /app

# Instala um servidor estático simples
RUN npm i -g http-server@14

# Copiamos TODO o dist e escolhemos a pasta em runtime
COPY --from=builder /app/dist /app/dist

# Nome do projeto Angular (ajuste se necessário)
# Em Angular 17+ geralmente o output é dist/<APP_NAME>/browser
ENV APP_NAME=web
ENV DIST_DIR=/app/dist/${APP_NAME}/browser

EXPOSE 4200
# Se DIST_DIR não existir (ex.: Angular <=16), tente /app/dist/${APP_NAME}
CMD sh -c 'if [ -d "$DIST_DIR" ]; then d="$DIST_DIR"; \
           elif [ -d "/app/dist/${APP_NAME}" ]; then d="/app/dist/${APP_NAME}"; \
           else echo "Dist não encontrado. Verifique APP_NAME e outputPath no angular.json"; exit 1; fi; \
           echo "Servindo $d"; http-server "$d" -p 4200 -a 0.0.0.0 --gzip --cors'
