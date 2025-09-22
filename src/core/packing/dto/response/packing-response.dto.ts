import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDTO } from '../../../../utils/api-response.dto';

class BoxResultDto {
  @ApiProperty({
    description: 'ID da caixa utilizada. Será nulo se o produto não couber em nenhuma.',
    example: 'Caixa 2',
    nullable: true,
  })
  caixa_id: string | null;

  @ApiProperty({
    description: 'Lista de IDs dos produtos alocados nesta caixa.',
    example: ['PS5', 'Volante'],
  })
  produtos: string[];

  @ApiProperty({
    description: 'Observação para produtos que não couberam em nenhuma caixa.',
    example: 'Produto(s) não cabe(m) em nenhuma caixa disponível.',
    required: false,
  })
  observacao?: string;
}

class OrderResultDto {
  @ApiProperty({ description: 'ID do pedido processado.', example: 1 })
  pedido_id: number;

  @ApiProperty({
    description: 'Lista de caixas utilizadas para este pedido.',
    isArray: true,
    type: () => BoxResultDto,
  })
  caixas: BoxResultDto[];
}

export class PackingResponseDTO {
  @ApiProperty({
    description: 'Lista de pedidos com os resultados do empacotamento.',
    isArray: true,
    type: () => OrderResultDto,
  })
  pedidos: OrderResultDto[];
}

export class ApiPackingResponseDTO  extends ApiResponseDTO {
  @ApiProperty({
    description: 'Dados da resposta dos pedidos',
    type: () => PackingResponseDTO,
  })
  readonly data: PackingResponseDTO;
}

export class ResponsePackingErrorDTO {
    @ApiProperty({
      description: 'Mensagem informativa',
      example: "pedidos must be an array",
    })
    message: string;  

    @ApiProperty({
      description: 'Status code do erro',
      example: 401,
    })
    statusCode: number; 

    @ApiProperty({
      description: 'Em casos de erro, o campo de dados é nulo.',
      nullable: true,
      example: null,
    })
    data;
}