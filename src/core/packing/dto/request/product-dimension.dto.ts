import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class ProductDimensionDto {
  @ApiProperty({
    description: 'Altura do produto em centímetros.',
    example: 40,
  })
  @IsNumber({}, { message: 'A altura deve ser um número.' })
  @IsPositive({ message: 'A altura deve ser um número positivo.' })
  altura: number;

  @ApiProperty({
    description: 'Largura do produto em centímetros.',
    example: 10,
  })
  @IsNumber({}, { message: 'A largura deve ser um número.' })
  @IsPositive({ message: 'A largura deve ser um número positivo.' })
  largura: number;

  @ApiProperty({
    description: 'Comprimento do produto em centímetros.',
    example: 25,
  })
  @IsNumber({}, { message: 'O comprimento deve ser um número.' })
  @IsPositive({ message: 'O comprimento deve ser um número positivo.' })
  comprimento: number;
}