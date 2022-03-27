import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './components/order/order.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://localhost:${configService.get(
          'database.port'
        )}/${configService.get('database.name')}`
      }),
      inject: [ConfigService]
    }),
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
