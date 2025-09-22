import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'typeorm';
import { User } from '../src/core/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  jest.setTimeout(20000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should run the full authentication and protected route flow successfully', async () => {
    await request(app.getHttpServer())
      .post('/packing/calculate')
      .send({ pedidos: [] })
      .expect(401);

    const userCredentials = {
      username: 'e2e_user',
      email: 'e2e@test.com',
      password: 'Senha123@',
    };
    await request(app.getHttpServer())
      .post('/user')
      .send(userCredentials)
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth')
      .send({
        email: userCredentials.email,
        password: userCredentials.password,
      })
      .expect(200);

    const accessToken = loginResponse.body.access_token;
    expect(accessToken).toBeDefined();

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

    return request(app.getHttpServer())
      .post('/packing/calculate')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(packingRequestPayload)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('pedidos');
        expect(response.body.pedidos[0].caixas[0].caixa_id).toBe('Caixa 1');
      });
  });
});