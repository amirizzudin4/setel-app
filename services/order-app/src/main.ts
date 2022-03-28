import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      url: configService.get('redis.url')
    }
  });

  const config = new DocumentBuilder()
    .setTitle('Order Application')
    .setDescription('Application to order')
    .setVersion('1.0')
    .addTag('Order')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  await app.startAllMicroservices();
  await app.listen(configService.get('port'), () =>
    console.log('connected to port ' + configService.get('port'))
  );
}

bootstrap();
