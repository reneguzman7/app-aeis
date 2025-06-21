import { AppController } from '../src/app.controller';

describe('AppController Unit Tests', () => {
  let appController: AppController;

  beforeEach(() => {
    appController = new AppController();
  });

  describe('Validation Tests', () => {
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
        nombre: 'Bloque Test',
        filas: 0,
        columnas: 5,
      };

      const result = await appController.createBloque(createBloqueDto);

      expect(result.success).toBe(false);
      expect(result.error).toContain('filas deben estar entre 1 y 10');
    });

    it('should reject bloque with invalid columns', async () => {
      const createBloqueDto = {
        nombre: 'Bloque Test',
        filas: 3,
        columnas: 20,
      };

      const result = await appController.createBloque(createBloqueDto);

      expect(result.success).toBe(false);
      expect(result.error).toContain('columnas deben estar entre 1 y 15');
    });

    it('should reject invalid casillero ID', async () => {
      const result = await appController.updateCasillero(0, { estado: 'Disponible' });

      expect(result.success).toBe(false);
      expect(result.error).toContain('ID de casillero inválido');
    });

    it('should reject invalid estado', async () => {
      const result = await appController.updateCasillero(1, { estado: 'InvalidEstado' as any });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Estado inválido');
    });

    it('should reject invalid bloque ID for deletion', async () => {
      const result = await appController.deleteBloque(0);

      expect(result.success).toBe(false);
      expect(result.error).toContain('ID de bloque inválido');
    });
  });

  describe('Health Check', () => {
    it('should return health status structure', async () => {
      const result = await appController.getHealth();

      expect(typeof result.success).toBe('boolean');
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
    });
  });
});
