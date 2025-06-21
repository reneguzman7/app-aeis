# AEIS - Sistema de Gestión de Casilleros

Sistema modular de gestión de casilleros desarrollado con TypeScript siguiendo principios de arquitectura limpia.

## 🏗️ Arquitectura

### Estructura del Proyecto

```
📁 aeis-casilleros/
├── 📁 public/              # Interfaz web (HTML + React)
│   ├── index.html          # Frontend que consume la API
│   ├── styles.css          # Estilos CSS
│   └── favicon.ico         # Icono de la aplicación
│
├── 📁 src/                 # Backend TypeScript
│   ├── app.controller.ts   # Controlador principal (rutas y validaciones)
│   ├── app.service.ts      # Servicios de lógica de negocio
│   ├── app.module.ts       # Configuración y módulos
│   └── main.ts             # Punto de entrada de la aplicación
│
├── 📁 test/                # Pruebas
│   ├── app.controller.spec.ts  # Pruebas unitarias del controlador
│   ├── app.e2e-spec.ts        # Pruebas end-to-end
│   └── jest-e2e.json          # Configuración de Jest para E2E
│
├── .gitignore              # Archivos ignorados por Git
├── .prettierrc             # Configuración de Prettier
├── Dockerfile              # Configuración de Docker
├── README.md               # Esta documentación
├── eslint.config.mjs       # Configuración de ESLint
├── nest-cli.json           # Configuración del CLI
├── package.json            # Dependencias y scripts
├── tsconfig.build.json     # Configuración de TypeScript para build
└── tsconfig.json           # Configuración principal de TypeScript
```

### Separación de Responsabilidades

**📁 Backend (src/)**

- **app.controller.ts**: Maneja peticiones HTTP, validaciones y respuestas
- **app.service.ts**: Contiene toda la lógica de negocio y operaciones con BD
- **app.module.ts**: Configuración de Supabase y bootstrap de la aplicación
- **main.ts**: Inicialización y punto de entrada

**📁 Frontend (public/)**

- **index.html**: Interfaz React que consume la API TypeScript
- **styles.css**: Estilos modernos y responsive

**📁 Tests (test/)**

- **Unitarios**: Validaciones, lógica de negocio
- **E2E**: Flujos completos de la aplicación

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 18+
- Una cuenta en [Supabase](https://supabase.io)
- npm o yarn

### 1. Configuración de la Base de Datos

Crea las siguientes tablas en Supabase:

```sql
-- Tabla de bloques
CREATE TABLE bloques (
    id SERIAL PRIMARY KEY,
    nombre_bloque VARCHAR(100) NOT NULL,
    nro_filas INTEGER DEFAULT 1,
    nro_columnas INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de casilleros
CREATE TABLE casilleros (
    id_casillero SERIAL PRIMARY KEY,
    numero_casillero VARCHAR(50) NOT NULL,
    estado VARCHAR(20) DEFAULT 'Disponible',
    bloque_id INTEGER REFERENCES bloques(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Configuración del Proyecto

```bash
# Clonar e instalar dependencias
git clone <repo-url>
cd aeis-casilleros
npm install

# Configurar credenciales de Supabase en src/app.module.ts
# Actualizar supabaseUrl y supabaseKey
```

### 3. Scripts Disponibles

```bash
# Desarrollo
npm run start:dev        # Inicia la API TypeScript con hot reload
npm run serve           # Sirve la interfaz web en puerto 3000
npm run dev             # Inicia ambos servicios simultáneamente

# Producción
npm run build           # Compila TypeScript a JavaScript
npm run start:prod      # Ejecuta la versión compilada

# Testing
npm run test            # Ejecuta pruebas unitarias
npm run test:watch      # Ejecuta pruebas en modo watch
npm run test:cov        # Ejecuta pruebas con reporte de cobertura
npm run test:e2e        # Ejecuta pruebas end-to-end

# Calidad de código
npm run lint            # Ejecuta ESLint y corrige errores automáticamente
```

## 📋 Funcionalidades

### Backend API (TypeScript)

**Gestión de Bloques**

- `GET /bloques` - Obtener todos los bloques con casilleros
- `POST /bloques` - Crear nuevo bloque (genera casilleros automáticamente)
- `DELETE /bloques/:id` - Eliminar bloque y sus casilleros

**Gestión de Casilleros**

- `PATCH /casilleros/:id` - Actualizar estado de casillero
- Estados: `Disponible`, `Ocupado`, `Averiado`

**Estadísticas**

- `GET /estadisticas` - Obtener métricas de ocupación
- `GET /health` - Health check de la API

**Validaciones**

- Nombres de bloque requeridos
- Límites: 1-10 filas, 1-15 columnas
- Estados válidos para casilleros
- IDs numéricos válidos

### Frontend (React)

**Interfaz de Usuario**

- ✅ Vista de bloques en grid responsive
- ✅ Creación de bloques con validación en tiempo real
- ✅ Visualización de casilleros por fila/columna
- ✅ Cambio de estados con colores distintivos
- ✅ Modales para operaciones
- ✅ Manejo de errores y loading states

**Conexión con API**

- Consume los endpoints TypeScript
- Validación en frontend y backend
- Feedback visual inmediato

## 🧪 Testing

### Pruebas Unitarias

```bash
npm run test
```

- Validaciones de controlador
- Lógica de negocio del servicio
- Manejo de errores
- Casos límite

### Pruebas E2E

```bash
npm run test:e2e
```

- Flujo completo CRUD
- Integración con base de datos
- Validaciones de interfaz

### Cobertura

```bash
npm run test:cov
```

Genera reporte HTML en `coverage/`

## 🐳 Docker

### Desarrollo

```bash
docker build -t aeis-casilleros .
docker run -p 3000:3000 aeis-casilleros
```

### Producción

```bash
# El Dockerfile incluye:
# - Build optimizado multi-stage
# - Usuario no-root para seguridad
# - Variables de entorno configurables
# - Instalación solo de dependencias de producción
```

## 🔧 Configuración Avanzada

### Variables de Entorno

```bash
NODE_ENV=production
PORT=3000
SUPABASE_URL=tu_url
SUPABASE_ANON_KEY=tu_key
```

### ESLint y Prettier

- Configuración automática de formato
- Reglas TypeScript específicas
- Integración con VS Code

### TypeScript

- Configuración estricta pero práctica
- Path mapping para imports limpios
- Separación de config para build y desarrollo

## 📈 Arquitectura y Principios

### Principios Aplicados

1. **Separación de Responsabilidades**: Cada archivo tiene un propósito específico
2. **Inyección de Dependencias**: Service consumido por Controller
3. **Validación por Capas**: Frontend + Backend
4. **Error Handling**: Manejo consistente de errores
5. **Testing**: Cobertura unitaria y E2E

### Patrón de Arquitectura

```
Frontend (React) → Controller (Validaciones) → Service (Lógica) → Database (Supabase)
                     ↓
                  Tests (Jest)
```

### Escalabilidad

- Fácil agregar nuevos controladores
- Servicios modulares y reutilizables
- Tests automatizados para regresión
- Docker para despliegue consistente

## 🔮 Próximos Pasos

### Funcionalidades Futuras

- 🔐 Autenticación con roles
- 📊 Dashboard con métricas avanzadas
- 🔔 Notificaciones en tiempo real
- 📱 Progressive Web App (PWA)
- 🗃️ Backup y restauración de datos

### Mejoras Técnicas

- ⚡ Caché con Redis
- 🔄 WebSockets para updates en tiempo real
- 🚀 CI/CD con GitHub Actions
- 📝 Documentación automática con Swagger
- 🌐 Internacionalización (i18n)

---

**Desarrollado por el equipo AEIS - EPN**  
_Versión 2.0 - Arquitectura TypeScript Modular_
