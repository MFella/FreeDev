import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { constans } from "./constans";
import { AuthService } from "./auth.service";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authServ: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: constans.secret,
            algorithms: ['HS256', 'HS384']
        })
    }

    async validate(payload?: any) {
        const { email } = payload;
        const user = await this.authServ.getUserByEmail(email);
        return { userId: user._id, email: payload.email };
    }

}