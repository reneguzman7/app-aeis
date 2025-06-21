# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY src/ ./src/

# Construir aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

WORKDIR /app

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S aeis -u 1001

# Copiar archivos necesarios
COPY package*.json ./
COPY --from=builder /app/dist ./dist
COPY public/ ./public/

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Cambiar al usuario no-root
USER aeis

# Exponer puerto
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicio
CMD ["npm", "run", "start:prod"]
