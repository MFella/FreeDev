import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeveloperToCreateDto } from 'src/dtos/developerToCreateDto';
import { HunterToCreateDto } from 'src/dtos/hunterToCreateDto';
import { Developer, DeveloperDocument } from './developer.schema';
import { Hunter, HunterDocument } from './hunter.schema';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/types/roles';
import { UserToProfileDto } from 'src/dtos/userToProfileDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Developer.name)
    private developerModel: Model<DeveloperDocument>,
    @InjectModel(Hunter.name) private hunterModel: Model<HunterDocument>,
  ) {}

  async createDeveloper(
    developerToCreateDto: DeveloperToCreateDto,
  ): Promise<boolean> {
    const hipoUser = this.isUserAlreadyExists(developerToCreateDto?.email);
    if (hipoUser) {
      throw new BadRequestException('User with that email already exist!');
    }

    try {
      const { password, ...restOfDto } = developerToCreateDto;
      const passwordSalt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, passwordSalt);

      const developerToCreate = {
        passwordHash,
        passwordSalt,
        role: Roles.DEVELOPER,
        ...restOfDto,
      };

      const response = await this.developerModel.create(developerToCreate);

      if (response) return true;
    } catch (e) {
      throw new InternalServerErrorException(
        'Problem occured during saving developer. Try again in couple of minutes',
      );
    }
  }

  async createHunter(hunterToCreateDto: HunterToCreateDto): Promise<boolean> {
    const hipoUser = this.isUserAlreadyExists(hunterToCreateDto?.email);
    if (hipoUser) {
      throw new BadRequestException('User with that email already exist!');
    }

    try {
      const { password, ...restOfDto } = hunterToCreateDto;
      const passwordSalt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, passwordSalt);

      const hunterToCreate = {
        passwordHash,
        passwordSalt,
        role: Roles.HUNTER,
        ...restOfDto,
      };

      const response = await this.hunterModel.create(hunterToCreate);
      if (response) return true;
    } catch (e) {
      throw new InternalServerErrorException(
        'Problem occured during saving developer. Try again in couple of minutes',
      );
    }
  }

  async findUserById(userId: string): Promise<any> {
    const hipoDeveloper = await (
      await this.developerModel.findOne({ _id: userId }).exec()
    )?.toObject();

    if (hipoDeveloper) return hipoDeveloper;

    const hipoHunter = (
      await this.hunterModel.findOne({ _id: userId }).exec()
    )?.toObject();

    if (hipoHunter) return hipoHunter;

    return {};
  }

  async findUserByEmail(email: string): Promise<any> {
    const hipoDeveloper = await (
      await this.developerModel.findOne({ email }).exec()
    )?.toObject();

    if (hipoDeveloper) return hipoDeveloper;

    const hipoHunter = (
      await this.hunterModel.findOne({ email }).exec()
    )?.toObject();

    if (hipoHunter) return hipoHunter;

    return {};
  }

  async isUserAlreadyExists(email: string): Promise<boolean> {
    return !!(await this.findUserByEmail(email));
  }

  async getUserProfile(id: string, storedUser: any): Promise<UserToProfileDto> {
    const userFromDb = await this.findUserById(id);

    if (!userFromDb) {
      throw new BadRequestException('User with that id doesnt exist');
    }

    try {
      const amIOwner: boolean =
        storedUser.userId.toString() === userFromDb._id.toString();

      const { password, repeatPassword, ...rest } = userFromDb;

      const userToProfileDto: UserToProfileDto = {
        amIOwner,
        ...rest,
      };

      return userToProfileDto;
    } catch (e) {
      throw new InternalServerErrorException(
        'Error occured during retriving data',
      );
    }
  }
}
