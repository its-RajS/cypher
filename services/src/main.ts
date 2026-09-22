import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
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
  });

  // webhook handle fix
  app.use((req: RawBodyRequest, res: Response, next: NextFunction) => {
    if (req.originalUrl.includes('/webhook')) {
      bodyParser.raw({ type: 'application/json' })(req, res, (err?: Error) => {
        if (err) return next(err);
        req.rawBody = req.body as Buffer;
        try {
          req.body = JSON.parse(req.rawBody.toString()) as unknown;
        } catch {
          req.body = {};
        }
        next();
      });
    } else {
      bodyParser.json()(req, res, next);
    }
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
