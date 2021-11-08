import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Developer, DeveloperSchema } from 'src/users/developer.schema';
import { Hunter, HunterSchema } from 'src/users/hunter.schema';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { constans } from './constans';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Developer.name, schema: DeveloperSchema },
      { name: Hunter.name, schema: HunterSchema },
    ]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: constans.secret,
      signOptions: { expiresIn: constans.expiresIn },
    }),
  ],
  providers: [AuthService, UsersService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
