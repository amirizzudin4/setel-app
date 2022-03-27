import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './components/order/order.module';
import { PaymentModule } from './components/payment/payment.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.get('database.url')}/${configService.get(
          'database.name'
        )}`,
        connectionFactory: (connection) => {
          connection.plugin(require('mongoose-autopopulate'));
          return connection;
        }
      }),
      inject: [ConfigService]
    }),
    OrderModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
