import { Test, TestingModule } from '@nestjs/testing';
import { PackingService } from '../packing.service';
import { OrderDto } from '../dto/request/order.dto';

describe('PackingService', () => {
  let service: PackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackingService],
    }).compile();

    service = module.get<PackingService>(PackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Teste 1: Cenário Simples
  it('should package a single small item into the smallest possible box (Caixa 1)', () => {
    const mockOrder: OrderDto = {
      pedido_id: 1,
      produtos: [
        {
          produto_id: 'Mousepad',
          dimensoes: { altura: 1, largura: 30, comprimento: 25 },
        },
      ],
    };

    const result = service.processarPedido(mockOrder);

    expect(result.caixas).toHaveLength(1);
    expect(result.caixas[0].caixa_id).toBe('Caixa 1');
    expect(result.caixas[0].produtos).toContain('Mousepad');
  });

  // Teste 2: Agrupamento em uma única caixa
  it('should group multiple small items into a single box', () => {
    const mockOrder: OrderDto = {
      pedido_id: 2,
      produtos: [
        {
          produto_id: 'Controle Xbox',
          dimensoes: { altura: 10, largura: 15, comprimento: 10 },
        },
        {
          produto_id: 'Carregador',
          dimensoes: { altura: 3, largura: 8, comprimento: 8 },
        },
      ],
    };

    const result = service.processarPedido(mockOrder);

    expect(result.caixas).toHaveLength(1);
    expect(result.caixas[0].caixa_id).toBe('Caixa 1');
    expect(result.caixas[0].produtos).toEqual(['Controle Xbox', 'Carregador']);
  });

  // Teste 3: Produto grande demais
  it('should handle a product that is too large for any box', () => {
    const mockOrder: OrderDto = {
      pedido_id: 5,
      produtos: [
        {
          produto_id: 'Cadeira Gamer',
          dimensoes: { altura: 120, largura: 60, comprimento: 70 },
        },
      ],
    };

    const result = service.processarPedido(mockOrder);

    expect(result.caixas).toHaveLength(1);
    expect(result.caixas[0].caixa_id).toBeNull();
    expect(result.caixas[0].produtos).toContain('Cadeira Gamer');
    expect(result.caixas[0].observacao).toBeDefined();
  });

  // Teste 4: Múltiplas Caixas
  it('should group large and long items together if they fit in a large box', () => {
    const mockOrder: OrderDto = {
      pedido_id: 7,
      produtos: [
        {
          produto_id: 'Monitor Grande',
          dimensoes: { altura: 50, largura: 70, comprimento: 50 },
        },
        {
          produto_id: 'Soundbar',
          dimensoes: { altura: 15, largura: 80, comprimento: 15 },
        },
      ],
    };

    const result = service.processarPedido(mockOrder);


    expect(result.caixas).toHaveLength(1);
    expect(result.caixas[0].caixa_id).toBe('Caixa 3');
    expect(result.caixas[0].produtos).toHaveLength(2);
    expect(result.caixas[0].produtos).toContain('Monitor Grande');
    expect(result.caixas[0].produtos).toContain('Soundbar');
  });

  // Teste 5: Pedido Vazio
  it('should handle an order with no products', () => {
    const mockOrder: OrderDto = {
      pedido_id: 99,
      produtos: [],
    };

    const result = service.processarPedido(mockOrder);

    expect(result.caixas).toHaveLength(0);
  });
});