import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards} from '@nestjs/common';
import { PackingService } from './packing.service';
import { PackingRequestDto } from './dto/request/packing-request.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { ApiPackingResponseDTO, ResponsePackingErrorDTO } from './dto/response/packing-response.dto';
import { ApiKeyGuard } from '../auth/guard/apiKey.guard';

@ApiSecurity('ApiKeyAuth')
@Controller('packing')
export class PackingController {
  constructor(private readonly service: PackingService) {}

  @UseGuards(ApiKeyGuard)
  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calcula o melhor empacotamento para uma lista de pedidos',
    description:
      'Recebe uma lista de pedidos com seus respectivos produtos e dimensões, e retorna a melhor alocação de produtos em caixas disponíveis.',
  })
  @ApiBody({
    description: 'Corpo da requisição contendo os pedidos a serem processados.',
    type: PackingRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Cálculo de empacotamento realizado com sucesso.',
    type: ApiPackingResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação nos dados de entrada (Bad Request).',
    type: ResponsePackingErrorDTO
  })
  process(@Body() body: PackingRequestDto) {
      const resultados = body.pedidos.map((pedido) =>
      this.service.processarPedido(pedido),
    );

    return { pedidos: resultados };
  }
}
