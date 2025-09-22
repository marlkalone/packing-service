import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductDimensionDto } from './product-dimension.dto';
import { ApiProperty } from '@nestjs/swagger';
export class ProductDto {
  @ApiProperty({
    description: 'Identificador único do produto.',
    example: 'PS5',
  })
  @IsString()
  produto_id: string;

  @ApiProperty({
    description: 'Objeto contendo as dimensões do produto.',
    type: () => ProductDimensionDto,
  })
  @ValidateNested()
  @Type(() => ProductDimensionDto)
  dimensoes: ProductDimensionDto;
}