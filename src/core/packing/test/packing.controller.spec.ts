import { Test, TestingModule } from '@nestjs/testing';
import { PackingController } from '../packing.controller';
import { PackingService } from '../packing.service';
import { PackingRequestDto } from '../dto/request/packing-request.dto';
import { AuthService } from '../../../core/auth/auth.service';
import { ApiKeyGuard } from '../../../core/auth/guard/apiKey.guard';

describe('PackingController', () => {
  let controller: PackingController;
  let service: PackingService;

  const mockPackingService = {
    processarPedido: jest.fn(),
  };

  const mockAuthService = {
    validateApiKey: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackingController],
      providers: [
        {
          provide: PackingService,
          useValue: mockPackingService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        ApiKeyGuard,
      ],
    }).compile();

    controller = module.get<PackingController>(PackingController);
    service = module.get<PackingService>(PackingService); // Pegamos a instância do mock
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('process', () => {
    it('should call the service for each order and return the results', () => {
      const mockRequest: PackingRequestDto = {
        pedidos: [
          { pedido_id: 1, produtos: [] },
          { pedido_id: 2, produtos: [] },
        ],
      };

      const mockServiceResponse = {
        pedido_id: 1,
        caixas: [{ caixa_id: 'Caixa 1', produtos: ['Produto Mock'] }],
      };
      
      mockPackingService.processarPedido.mockReturnValue(mockServiceResponse);

      const result = controller.process(mockRequest);


      expect(service.processarPedido).toHaveBeenCalledTimes(
        mockRequest.pedidos.length,
      );

      expect(service.processarPedido).toHaveBeenCalledWith(
        mockRequest.pedidos[0],
      );

      expect(result).toEqual({
        pedidos: [mockServiceResponse, mockServiceResponse],
      });
    });
  });
});