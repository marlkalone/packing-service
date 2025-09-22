import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthResponseDTO } from './dto/health-response.dto';

@Controller('/')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Retorna o heath status da API',
    description:
      'Recebe requisições de consulta de status e sinaliza se a api está no ar',
  })
  @ApiResponse({
    status: 200,
    description: 'API online!',
    type: HealthResponseDTO,
  })
  live() {
    return { status: 'alive' };
  }
}
