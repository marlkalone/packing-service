import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiKeyGuard } from './guard/apiKey.guard';

@Module({
  providers: [AuthService, ApiKeyGuard],
  exports: [AuthService, ApiKeyGuard]
})
export class AuthModule {}
