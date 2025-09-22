import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderDto } from './order.dto';

export class PackingRequestDto {
  @ApiProperty({
    description: 'Array contendo a lista de pedidos a serem processados.',
    isArray: true,
    type: () => OrderDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDto)
  pedidos: OrderDto[];
}