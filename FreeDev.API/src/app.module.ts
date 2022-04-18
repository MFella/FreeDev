import { OfferModule } from './offers/offer.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AppGateway } from './app.gateway';
import { MessageModule } from './web-socket-messages/message.module';
import { WebSocketMessageService } from './web-socket-messages/webSocketMessage.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/freeDev'),
    UsersModule,
    AuthModule,
    OfferModule,
    MessageModule,
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      isGlobal: true,
      // validationSchema: Joi.object({
      //   AWS_REGION: Joi.string().required(),
      //   AWS_ACCESS_KEY_ID: Joi.string().required(),
      //   AWS_SECRET_ACCESS_KEY: Joi.string().required(),
      // }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
