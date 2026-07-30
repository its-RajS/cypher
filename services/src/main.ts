import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 8080);
}
void bootstrap();
