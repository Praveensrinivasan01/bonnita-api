import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { portConfig } from './configuration/database.configuration';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.setGlobalPrefix('api')

  const swaggerOptions = new DocumentBuilder()
    .setTitle('BONNITA API-DOCUMENTATION')
    // .setDescription('Sample Description')
    .addTag('Modules')
    .addBearerAuth({ type: 'apiKey', name: 'Authorization', in: 'header' })
    .build()

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('swagger-api', app, document)


  app.enableCors({  origin: '*'});
  await app.listen(8001);
}
bootstrap();
