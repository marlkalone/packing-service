import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  const mockApiKey = 'minha-chave-secreta-de-teste-123';

  const mockConfigService = {
    get: jest.fn(),
  };

  describe('Service Initialization', () => {
    it('should throw an error if API_KEY is not defined', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      await expect(
        Test.createTestingModule({
          providers: [
            AuthService,
            {
              provide: ConfigService,
              useValue: mockConfigService,
            },
          ],
        }).compile(),
      ).rejects.toThrow(
        'A variável de ambiente API_KEY não foi definida.',
      );
    });

    it('should initialize successfully if API_KEY is defined', async () => {
        mockConfigService.get.mockReturnValue(mockApiKey);
  
        await expect(
          Test.createTestingModule({
            providers: [
              AuthService,
              {
                provide: ConfigService,
                useValue: mockConfigService,
              },
            ],
          }).compile(),
        ).resolves.toBeDefined();
      });
  });

  describe('validateApiKey', () => {
    let service: AuthService;

    beforeEach(async () => {
      mockConfigService.get.mockReturnValue(mockApiKey);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
        ],
      }).compile();

      service = module.get<AuthService>(AuthService);
    });

    it('should return true if the provided API key is valid', () => {
      const providedKey = 'minha-chave-secreta-de-teste-123';

      const isValid = service.validateApiKey(providedKey);

      expect(isValid).toBe(true);
    });

    it('should return false if the provided API key is invalid', () => {
      const providedKey = 'chave-errada';

      const isValid = service.validateApiKey(providedKey);

      expect(isValid).toBe(false);
    });
    
    it('should return false if the provided API key is null or undefined', () => {
        expect(service.validateApiKey(null as any)).toBe(false);
        expect(service.validateApiKey(undefined as any)).toBe(false);
    });
  });
});