import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('CMS API')
    .setDescription('The CMS API description')
    .setVersion('1.0')
    .addBearerAuth() // Add this if your API uses Bearer token authentication
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
