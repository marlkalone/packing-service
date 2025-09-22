import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly validApiKey: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('API_KEY');

    if (!apiKey) {
      throw new Error('A variável de ambiente API_KEY não foi definida.');
    }

    this.validApiKey = apiKey;
  }

  validateApiKey(apiKey: string): boolean {
    return apiKey === this.validApiKey;
  }
}
