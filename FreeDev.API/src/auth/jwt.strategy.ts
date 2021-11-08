import { StoredUser } from './../types/storedUser.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { constans } from './constans';
import { AuthService } from './auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authServ: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: constans.secret,
      algorithms: ['HS256', 'HS384'],
    });
  }

  async validate(payload?: any): Promise<StoredUser> {
    const { email } = payload;
    const user = await this.authServ.getUserByEmail(email);

    return { userId: user._id, email: payload.email, role: user?.role };
  }
}
