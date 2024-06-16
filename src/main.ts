import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { portConfig } from './configuration/database.configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')

  const swaggerOptions = new DocumentBuilder()
    .setTitle('BONNITA API-DOCUMENTATION')
    // .setDescription('Sample Description')
    .addTag('Modules')
    .addBearerAuth({ type: 'apiKey', name: 'Authorization', in: 'header' })
    .build()

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('swagger-api', app, document)


  app.enableCors();
  await app.listen(8001);
}
bootstrap();
