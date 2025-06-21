# 1. Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración y dependencias primero (para cache layer)
COPY package*.json ./
COPY tsconfig*.json ./
COPY jest.config.js ./
COPY nest-cli.json ./

# Instalar todas las dependencias (dev + prod)
RUN npm ci

# Copiar código fuente
COPY src/ ./src/
COPY public/ ./public/

# Compilar proyecto TypeScript
RUN npm run build

# 2. Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Instalar dumb-init para manejo de señales
RUN apk add --no-cache dumb-init

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S aeis -u 1001 -G nodejs

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev && npm cache clean --force

# Copiar archivos compilados y estáticos desde builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Crear directorio para logs
RUN mkdir -p /app/logs && chown -R aeis:nodejs /app

# Cambiar al usuario no-root
USER aeis

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Exponer puerto
EXPOSE 4000

# Comando de inicio con dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
