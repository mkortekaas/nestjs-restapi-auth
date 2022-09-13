import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['verbose'],
  });

  // this reads configuration from app.module.ts and specifically PORT
  //    as defined in .env file
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');

  const config = new DocumentBuilder()
    .setTitle('IOT Example')
    .setDescription('IOT Example API')
    .setVersion('1.0')
    .addTag('iot')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  // json pretty print in development
  if (process.env.NODE_ENV !== 'production') {
    (app as any).httpAdapter.instance.set('json spaces', 2);
  }

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe(
      // turn this off in production?? (need validationPipe)
      {enableDebugMessages: true}
    )
  );
  
  await app.listen(PORT);
}
bootstrap();
