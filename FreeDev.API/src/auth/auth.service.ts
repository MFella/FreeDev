import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserToLoginDto } from 'src/dtos/userToLoginDto';
import { constans } from './constans';

@Injectable()
export class AuthService {

  constructor(
    private readonly userServ: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const userFromModel: any = await this.userServ.findUser(email);

    if (!Object.keys(userFromModel).length) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isHashMatchesPassword = await bcrypt.compare(password, userFromModel.passwordHash.toString());

    if (!isHashMatchesPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { passwordHash, passwordSalt, ...userToReturn } = userFromModel;
    
    return userToReturn;
  }

  async login(userToLoginDto: UserToLoginDto): Promise<any> {
    const validUser = await this.validateUser(userToLoginDto.email, userToLoginDto.password);

    if (validUser) {

      const payload = { email: validUser.email, _id: validUser._id.toString() };

      const details = {
          access_token: this.jwtService.sign(payload),
          expiresIn: constans.expiresIn,
          user: validUser
      };

      return details;
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    const userFromModel = await this.userServ.findUser(email);

    if (!userFromModel) return new UnauthorizedException('Invalid email or password');

    return userFromModel;
  }

}
