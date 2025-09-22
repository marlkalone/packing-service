import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigService } from '@nestjs/config';

describe('App (e2e)', () => {
  let app: INestApplication;
  let apiKey: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const configService = app.get(ConfigService);
    const keyFromEnv = configService.get<string>('API_KEY');

        if (!keyFromEnv) {
      throw new Error('STATIC_API_KEY não definida no ambiente de teste.');
    }
    apiKey = keyFromEnv;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health/live should return an alive status', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body.data.status).toEqual('alive');
      });
  });

  describe('/packing/calculate (POST)', () => {
    const packingRequestPayload = {
      pedidos: [
        {
          pedido_id: 1,
          produtos: [
            {
              produto_id: 'Headset',
              dimensoes: { altura: 25, largura: 15, comprimento: 20 },
            },
          ],
        },
      ],
    };

    it('should return 401 Unauthorized if no API Key is provided', () => {
      return request(app.getHttpServer())
        .post('/packing/calculate')
        .send(packingRequestPayload)
        .expect(401);
    });

    it('should return 401 Unauthorized if an invalid API Key is provided', () => {
      return request(app.getHttpServer())
        .post('/packing/calculate')
        .set('X-API-Key', 'chave-invalida-123')
        .send(packingRequestPayload)
        .expect(401);
    });

    it('should return 200 OK and calculate packaging if the correct API Key is provided', () => {
      return request(app.getHttpServer())
        .post('/packing/calculate')
        .set('X-API-Key', apiKey)
        .send(packingRequestPayload)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('statusCode', 200);
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('data');

          const responseData = response.body.data;
          expect(responseData).toHaveProperty('pedidos');
          expect(responseData.pedidos[0].caixas[0].caixa_id).toBe('Caixa 1');
        });
    });
  });
});