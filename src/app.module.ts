import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://blmvfknjszsonaebstwi.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsbXZma25qc3pzb25hZWJzdHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDU0NTAsImV4cCI6MjA2NTUyMTQ1MH0.FcENuiMsLjEkRpe6tbEVe4xHpLmOCdOj4dRVeUPI_QI';

// Cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Configuración de la aplicación
export const AppConfig = {
  supabaseUrl,
  supabaseKey,
  appName: 'AEIS - Gestión de Casilleros',
  version: '2.0.0',
  author: 'AEIS Team - EPN',
};

/**
 * Módulo principal que inicializa la configuración de la aplicación
 * Análogo al app.module.ts de NestJS
 */
export class AppModule {
  /**
   * Inicializa la aplicación y sus dependencias
   */
  static async bootstrap(): Promise<void> {
    try {
      // Verificar conexión con Supabase
      const { error } = await supabase
        .from('bloques')
        .select('count', { count: 'exact', head: true });

      if (error && error.code !== 'PGRST116') {
        // PGRST116 es "no rows found", está bien
        throw error;
      }

      console.log('✅ Conexión con Supabase establecida');
      console.log(`📱 ${AppConfig.appName} v${AppConfig.version} iniciado`);
    } catch (error) {
      console.error('❌ Error inicializando la aplicación:', error);
      throw error;
    }
  }

  /**
   * Configuración para desarrollo
   */
  static getDevelopmentConfig() {
    return {
      ...AppConfig,
      debug: true,
      logLevel: 'verbose',
    };
  }

  /**
   * Configuración para producción
   */
  static getProductionConfig() {
    return {
      ...AppConfig,
      debug: false,
      logLevel: 'error',
    };
  }
}
