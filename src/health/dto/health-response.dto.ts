import { ApiProperty } from "@nestjs/swagger";
import { ApiResponseDTO } from "../../utils/api-response.dto";

export class StatusHealthDTO {
    @ApiProperty({ 
        example: 'alive', 
        description: 'Mensagem informando que a API está no ar' 
    })
    status: string;
}

export class HealthResponseDTO  extends ApiResponseDTO{
    @ApiProperty({
      description: 'Status informando estado da aplicação',
      type: () => StatusHealthDTO,
    })
    readonly data: StatusHealthDTO;
}

