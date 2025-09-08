import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as os from 'os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  //Em dev (origens diferentes), habilitar CORS para o front local
  // app.enableCors();
  // app.enableCors({
  //   origin: 'http://localhost:4200',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });

  //Testa load balancer imprimindo X-Instance: api-1 OR api-2
  app.use((req, res, next) => {
    res.setHeader('X-Instance', os.hostname());
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
