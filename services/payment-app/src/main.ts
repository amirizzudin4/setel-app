import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      url: 'redis://localhost:6379',
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Payment Application')
    .setDescription('Application to payment')
    .setVersion('1.0')
    .addTag('Payment')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  await app.startAllMicroservices();
  await app.listen(4000, () => console.log('connected to port 4000'));
}
bootstrap();
