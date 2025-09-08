# ---- deps de produção (cacheável) ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ---- builder (gera dist) ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
# copie TODO o código
COPY . .
# gera /app/dist
RUN npm run build

# ---- runtime (leve) ----
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
# node_modules só de produção
COPY --from=deps /app/node_modules ./node_modules
# binários compilados
COPY --from=builder /app/dist ./dist
COPY package.json ./
EXPOSE 3000
USER node
CMD ["node", "dist/main.js"]
