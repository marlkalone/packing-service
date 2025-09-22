import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductDto } from './product.dto';
import { ApiProperty } from '@nestjs/swagger';
export class OrderDto {
  @ApiProperty({
    description: 'Identificador numérico do pedido.',
    example: 1,
  })
  @IsNumber()
  pedido_id: number;

  @ApiProperty({
    description: 'Lista de produtos contidos no pedido.',
    isArray: true,
    type: () => ProductDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  produtos: ProductDto[];
}