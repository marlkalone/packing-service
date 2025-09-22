import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { customCss } from './utils/cssDocs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const staticApiKey = configService.get<string>('API_KEY');

  const config = new DocumentBuilder()
    .setTitle('Loja do Seu Manoel - API de Empacotamento')
    .setDescription('API para calcular a melhor forma de empacotar pedidos de um e-commerce.')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',         
        name: 'X-API-Key',   
      },
      'ApiKeyAuth',         
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  const { apiReference } = await import('@scalar/nestjs-api-reference');

  app.use(
    '/docs',apiReference({
      theme: 'purple',
      darkMode: false,
      hideModels: true,
      hideDownloadButton: true,
      spec: {
        content: document,
      },
      customCss: customCss,
      authentication: {
        preferredSecurityScheme: 'ApiKeyAuth',
        apiKey: {
          token: staticApiKey,
        },
      },
    })
  );
  
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
