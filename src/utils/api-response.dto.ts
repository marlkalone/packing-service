import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export abstract class ApiResponseDTO {

    @Expose()
    @ApiProperty({ example: 'Operação realizada com sucesso!', description: 'Mensagem de resposta' })
    message: string;
  
    @Expose()
    @ApiProperty({ example: 200, description: 'Status code da resposta' })
    statusCode: number;
}