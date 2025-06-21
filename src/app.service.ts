import { supabase } from './app.module';

export interface Bloque {
  id: number;
  nombre_bloque: string;
  nro_filas: number;
  nro_columnas: number;
  created_at?: string;
  casilleros?: Casillero[];
}

export interface Casillero {
  id_casillero: number;
  numero_casillero: string;
  estado: 'Disponible' | 'Ocupado' | 'Averiado';
  bloque_id: number;
  created_at?: string;
  bloque?: Pick<Bloque, 'nombre_bloque'>;
}

export class AppService {
  /**
   * Obtiene todos los bloques con sus casilleros asociados
   */
  async getAllBloques(): Promise<Bloque[]> {
    try {
      const { data, error } = await supabase
        .from('bloques')
        .select('*, casilleros (*)')
        .order('id');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo bloques:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo bloque y genera automáticamente sus casilleros
   */
  async createBloque(nombre: string, filas: number, columnas: number): Promise<Bloque> {
    try {
      // Crear bloque
      const { data: bloque, error: bloqueError } = await supabase
        .from('bloques')
        .insert({
          nombre_bloque: nombre,
          nro_filas: filas,
          nro_columnas: columnas,
        })
        .select()
        .single();

      if (bloqueError) throw bloqueError;

      // Generar casilleros automáticamente
      const casilleros = [];
      for (let fila = 1; fila <= filas; fila++) {
        for (let col = 1; col <= columnas; col++) {
          casilleros.push({
            numero_casillero: `${nombre}-${fila}-${col}`,
            estado: 'Disponible' as const,
            bloque_id: bloque.id,
          });
        }
      }

      const { error: casillerosError } = await supabase.from('casilleros').insert(casilleros);

      if (casillerosError) throw casillerosError;

      return bloque;
    } catch (error) {
      console.error('Error creando bloque:', error);
      throw error;
    }
  }

  /**
   * Actualiza el estado de un casillero específico
   */
  async updateEstadoCasillero(
    idCasillero: number,
    nuevoEstado: Casillero['estado']
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('casilleros')
        .update({ estado: nuevoEstado })
        .eq('id_casillero', idCasillero);

      if (error) throw error;
    } catch (error) {
      console.error('Error actualizando casillero:', error);
      throw error;
    }
  }

  /**
   * Elimina un bloque y todos sus casilleros asociados
   */
  async deleteBloque(idBloque: number): Promise<void> {
    try {
      const { error } = await supabase.from('bloques').delete().eq('id', idBloque);

      if (error) throw error;
    } catch (error) {
      console.error('Error eliminando bloque:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de ocupación de casilleros
   */
  async getEstadisticas(): Promise<{
    total: number;
    disponibles: number;
    ocupados: number;
    averiados: number;
  }> {
    try {
      const { data, error } = await supabase.from('casilleros').select('estado');

      if (error) throw error;

      const stats = (data || []).reduce(
        (acc, casillero) => {
          acc.total++;
          switch (casillero.estado) {
            case 'Disponible':
              acc.disponibles++;
              break;
            case 'Ocupado':
              acc.ocupados++;
              break;
            case 'Averiado':
              acc.averiados++;
              break;
          }
          return acc;
        },
        { total: 0, disponibles: 0, ocupados: 0, averiados: 0 }
      );

      return stats;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los casilleros de un bloque específico
   */
  async getCasillerosByBloque(bloqueId: number): Promise<Casillero[]> {
    try {
      const { data, error } = await supabase
        .from('casilleros')
        .select('*, bloque:bloques(nombre_bloque)')
        .eq('bloque_id', bloqueId)
        .order('numero_casillero');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo casilleros del bloque:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo casillero en un bloque específico
   */
  async createCasillero(bloqueId: number, numero: number): Promise<Casillero> {
    try {
      // Obtener el nombre del bloque para generar el número de casillero
      const { data: bloque, error: bloqueError } = await supabase
        .from('bloques')
        .select('nombre_bloque')
        .eq('id', bloqueId)
        .single();

      if (bloqueError) throw bloqueError;

      const numeroCasillero = `${bloque.nombre_bloque}-${numero}`;

      const { data: casillero, error: casilleroError } = await supabase
        .from('casilleros')
        .insert({
          numero_casillero: numeroCasillero,
          estado: 'Disponible' as const,
          bloque_id: bloqueId,
        })
        .select()
        .single();

      if (casilleroError) throw casilleroError;
      return casillero;
    } catch (error) {
      console.error('Error creando casillero:', error);
      throw error;
    }
  }

  /**
   * Elimina un casillero específico
   */ async deleteCasillero(idCasillero: number): Promise<void> {
    try {
      const { error } = await supabase.from('casilleros').delete().eq('id_casillero', idCasillero);

      if (error) throw error;
    } catch (error) {
      console.error('Error eliminando casillero:', error);
      throw error;
    }
  }
}
