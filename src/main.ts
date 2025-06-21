import express from 'express';
import cors from 'cors';
import { AppModule } from './app.module';
import { AppController } from './app.controller';

/**
 * Punto de entrada principal de la aplicación
 * Análogo al main.ts de NestJS con servidor HTTP
 */
async function bootstrap(): Promise<void> {
  try {
    console.log('🚀 Iniciando aplicación AEIS...');

    // Inicializar módulo principal
    await AppModule.bootstrap();

    // Crear aplicación Express
    const app = express();
    const port = process.env.PORT || 4000;

    // Middlewares
    app.use(cors());
    app.use(express.json());
    app.use(express.static('public'));

    // Crear instancia del controlador principal
    const appController = new AppController();

    // Verificar que todo funcione
    const healthCheck = await appController.getHealth();

    if (!healthCheck.success) {
      throw new Error(healthCheck.error || 'Error en health check');
    }

    // Rutas API
    app.get('/api/health', async (req, res) => {
      const result = await appController.getHealth();
      res.json(result);
    });

    app.get('/api/bloques', async (req, res) => {
      const result = await appController.getBloques();
      res.json(result);
    });

    app.post('/api/bloques', async (req, res) => {
      const result = await appController.createBloque(req.body);
      res.json(result);
    });

    app.delete('/api/bloques/:id', async (req, res) => {
      const result = await appController.deleteBloque(parseInt(req.params.id));
      res.json(result);
    });

    app.get('/api/casilleros/:bloqueId', async (req, res) => {
      const result = await appController.getCasilleros(parseInt(req.params.bloqueId));
      res.json(result);
    });

    app.post('/api/casilleros', async (req, res) => {
      const result = await appController.createCasillero(req.body);
      res.json(result);
    });

    app.put('/api/casilleros/:id', async (req, res) => {
      const result = await appController.updateCasillero(parseInt(req.params.id), req.body);
      res.json(result);
    });

    app.delete('/api/casilleros/:id', async (req, res) => {
      const result = await appController.deleteCasillero(parseInt(req.params.id));
      res.json(result);
    });

    // Iniciar servidor
    app.listen(port, () => {
      console.log('✅ Aplicación iniciada exitosamente');
      console.log(`🚀 Servidor HTTP corriendo en http://localhost:${port}`);
      console.log(`📊 API disponible en http://localhost:${port}/api`);
      console.log(`🌐 Frontend disponible en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Error iniciando la aplicación:', error);
    process.exit(1);
  }
}

// Inicializar aplicación
bootstrap();

// Exportar para uso en otros módulos
export { AppController, AppModule };
export * from './app.service';
export * from './app.controller';
