import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('Chave de API (X-API-Key) não fornecida.');
    }

    const isValid = this.authService.validateApiKey(apiKey);
    if (!isValid) {
      throw new UnauthorizedException('Chave de API inválida.');
    }

    return true;
  }
}