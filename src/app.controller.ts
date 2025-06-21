import { AppService, Bloque, Casillero } from './app.service';
import { AppModule } from './app.module';

export interface CreateBloqueDto {
  nombre: string;
  filas: number;
  columnas: number;
}

export interface UpdateCasilleroDto {
  estado: Casillero['estado'];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Controlador principal para la gestión de casilleros
 * Análogo al app.controller.ts de NestJS
 */
export class AppController {
  private appService: AppService;

  constructor() {
    this.appService = new AppService();
  }

  /**
   * Obtiene todos los bloques con sus casilleros
   * GET /bloques
   */
  async getBloques(): Promise<ApiResponse<Bloque[]>> {
    try {
      const bloques = await this.appService.getAllBloques();
      return {
        success: true,
        data: bloques,
        message: `Se encontraron ${bloques.length} bloques`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Crea un nuevo bloque
   * POST /bloques
   */
  async createBloque(createBloqueDto: CreateBloqueDto): Promise<ApiResponse<Bloque>> {
    try {
      // Validaciones
      if (!createBloqueDto.nombre?.trim()) {
        return {
          success: false,
          error: 'El nombre del bloque es requerido',
        };
      }

      if (createBloqueDto.filas < 1 || createBloqueDto.filas > 10) {
        return {
          success: false,
          error: 'Las filas deben estar entre 1 y 10',
        };
      }

      if (createBloqueDto.columnas < 1 || createBloqueDto.columnas > 15) {
        return {
          success: false,
          error: 'Las columnas deben estar entre 1 y 15',
        };
      }

      const bloque = await this.appService.createBloque(
        createBloqueDto.nombre.trim(),
        createBloqueDto.filas,
        createBloqueDto.columnas
      );

      return {
        success: true,
        data: bloque,
        message: `Bloque "${bloque.nombre_bloque}" creado exitosamente`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error creando el bloque',
      };
    }
  }

  /**
   * Obtiene los casilleros de un bloque específico
   * GET /casilleros/:bloqueId
   */
  async getCasilleros(bloqueId: number): Promise<ApiResponse<Casillero[]>> {
    try {
      if (!bloqueId || bloqueId < 1) {
        return {
          success: false,
          error: 'ID de bloque inválido',
        };
      }

      const casilleros = await this.appService.getCasillerosByBloque(bloqueId);
      return {
        success: true,
        data: casilleros,
        message: `Se encontraron ${casilleros.length} casilleros`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo casilleros',
      };
    }
  }

  /**
   * Crea un nuevo casillero en un bloque
   * POST /casilleros
   */
  async createCasillero(data: {
    bloque_id: number;
    numero: number;
  }): Promise<ApiResponse<Casillero>> {
    try {
      if (!data.bloque_id || data.bloque_id < 1) {
        return {
          success: false,
          error: 'ID de bloque inválido',
        };
      }

      if (!data.numero || data.numero < 1) {
        return {
          success: false,
          error: 'Número de casillero inválido',
        };
      }

      const casillero = await this.appService.createCasillero(data.bloque_id, data.numero);
      return {
        success: true,
        data: casillero,
        message: 'Casillero creado exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error creando casillero',
      };
    }
  }

  /**
   * Actualiza el estado de un casillero
   * PATCH /casilleros/:id
   */
  async updateCasillero(id: number, updateCasilleroDto: UpdateCasilleroDto): Promise<ApiResponse> {
    try {
      // Validaciones
      if (!id || id < 1) {
        return {
          success: false,
          error: 'ID de casillero inválido',
        };
      }

      const estadosValidos: Casillero['estado'][] = ['Disponible', 'Ocupado', 'Averiado'];
      if (!estadosValidos.includes(updateCasilleroDto.estado)) {
        return {
          success: false,
          error: `Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`,
        };
      }

      await this.appService.updateEstadoCasillero(id, updateCasilleroDto.estado);

      return {
        success: true,
        message: `Casillero actualizado a "${updateCasilleroDto.estado}"`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error actualizando el casillero',
      };
    }
  }

  /**
   * Elimina un bloque
   * DELETE /bloques/:id
   */
  async deleteBloque(id: number): Promise<ApiResponse> {
    try {
      if (!id || id < 1) {
        return {
          success: false,
          error: 'ID de bloque inválido',
        };
      }

      await this.appService.deleteBloque(id);

      return {
        success: true,
        message: 'Bloque eliminado exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error eliminando el bloque',
      };
    }
  }

  /**
   * Elimina un casillero
   * DELETE /casilleros/:id
   */
  async deleteCasillero(id: number): Promise<ApiResponse> {
    try {
      if (!id || id < 1) {
        return {
          success: false,
          error: 'ID de casillero inválido',
        };
      }

      await this.appService.deleteCasillero(id);
      return {
        success: true,
        message: 'Casillero eliminado exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error eliminando casillero',
      };
    }
  }

  /**
   * Obtiene estadísticas de ocupación
   * GET /estadisticas
   */
  async getEstadisticas(): Promise<ApiResponse> {
    try {
      const stats = await this.appService.getEstadisticas();
      return {
        success: true,
        data: stats,
        message: 'Estadísticas obtenidas exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo estadísticas',
      };
    }
  }

  /**
   * Endpoint de salud para verificar que la API funciona
   * GET /health
   */
  async getHealth(): Promise<ApiResponse> {
    try {
      await AppModule.bootstrap();
      return {
        success: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '2.0.0',
        },
        message: 'API funcionando correctamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'API no disponible',
      };
    }
  }
}
