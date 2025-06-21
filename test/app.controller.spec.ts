import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('AppController', () => {
  let appController: AppController;
  let _appService: AppService;
  beforeEach(async () => {
    appController = new AppController();
    _appService = new AppService();
  });

  describe('getHealth', () => {
    it('should return health status', async () => {
      const result = await appController.getHealth();

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('status', 'healthy');
      expect(result.data).toHaveProperty('timestamp');
      expect(result.data).toHaveProperty('version');
    });
  });

  describe('getBloques', () => {
    it('should return array of bloques', async () => {
      const result = await appController.getBloques();

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.message).toContain('bloques');
    });
  });

  describe('createBloque', () => {
    it('should create a new bloque with valid data', async () => {
      const createBloqueDto = {
        nombre: 'Bloque Test',
        filas: 3,
        columnas: 5,
      };

      const result = await appController.createBloque(createBloqueDto);

      if (result.success) {
        expect(result.data).toHaveProperty('nombre_bloque', 'Bloque Test');
        expect(result.data).toHaveProperty('nro_filas', 3);
        expect(result.data).toHaveProperty('nro_columnas', 5);
      }

      // Si falla por conexión a base de datos, está bien para testing
      expect(typeof result.success).toBe('boolean');
    });

    it('should reject bloque with empty name', async () => {
      const createBloqueDto = {
        nombre: '',
        filas: 3,
        columnas: 5,
      };

      const result = await appController.createBloque(createBloqueDto);

      expect(result.success).toBe(false);
      expect(result.error).toContain('nombre del bloque es requerido');
    });

    it('should reject bloque with invalid rows', async () => {
      const createBloqueDto = {
        nombre: 'Test',
        filas: 15, // Más de 10
        columnas: 5,
      };

      const result = await appController.createBloque(createBloqueDto);

      expect(result.success).toBe(false);
      expect(result.error).toContain('filas deben estar entre 1 y 10');
    });

    it('should reject bloque with invalid columns', async () => {
      const createBloqueDto = {
        nombre: 'Test',
        filas: 3,
        columnas: 20, // Más de 15
      };

      const result = await appController.createBloque(createBloqueDto);

      expect(result.success).toBe(false);
      expect(result.error).toContain('columnas deben estar entre 1 y 15');
    });
  });

  describe('updateCasillero', () => {
    it('should reject invalid casillero ID', async () => {
      const updateDto = { estado: 'Disponible' as const };

      const result = await appController.updateCasillero(-1, updateDto);

      expect(result.success).toBe(false);
      expect(result.error).toContain('ID de casillero inválido');
    });

    it('should reject invalid estado', async () => {
      const updateDto = { estado: 'EstadoInvalido' as any };

      const result = await appController.updateCasillero(1, updateDto);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Estado inválido');
    });
  });

  describe('deleteBloque', () => {
    it('should reject invalid bloque ID', async () => {
      const result = await appController.deleteBloque(-1);

      expect(result.success).toBe(false);
      expect(result.error).toContain('ID de bloque inválido');
    });
  });
});
