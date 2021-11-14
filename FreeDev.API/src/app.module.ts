import { OfferModule } from './offers/offer.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/freeDev'),
    UsersModule,
    AuthModule,
    OfferModule,
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
  providers: [AppService],
})
export class AppModule {}
