import {
  BadRequestException,
  ForbiddenException,
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
import { FileService } from 'src/files/file.service';
import { UserToUpdateDto } from 'src/dtos/userToUpdateDto';
import { ConfigService } from '@nestjs/config';
import { SignedFileUrlDto } from 'src/dtos/signedFileUrlDto';
import { UserToMessageListDto } from 'src/dtos/userToMessageListDto';
import { UserChatListParamsDto } from 'src/dtos/userChatListParamsDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Developer.name)
    private developerModel: Model<DeveloperDocument>,
    @InjectModel(Hunter.name)
    private hunterModel: Model<HunterDocument>,
    private readonly fileServ: FileService,
    private readonly configService: ConfigService,
  ) {}

  private static readonly DEFAULT_IMAGE_LINK: string =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Placeholder_no_text.svg/1200px-Placeholder_no_text.svg.png';

  async createDeveloper(
    developerToCreateDto: DeveloperToCreateDto,
  ): Promise<boolean> {
    const hipoUser = await this.isUserAlreadyExists(
      developerToCreateDto?.email,
    );
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
      console.log(developerToCreate);

      const response = await this.developerModel.create(developerToCreate);

      if (response) return true;
    } catch (e) {
      throw new InternalServerErrorException(
        'Problem occured during saving developer. Try again in couple of minutes',
      );
    }
  }

  async createHunter(hunterToCreateDto: HunterToCreateDto): Promise<boolean> {
    const hipoUser = await this.isUserAlreadyExists(hunterToCreateDto?.email);
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
      await await this.developerModel
        .findOne({ _id: userId })
        .populate('avatar')
        .exec()
    )?.toObject();

    if (hipoDeveloper) return hipoDeveloper;

    const hipoHunter = (
      await this.hunterModel.findOne({ _id: userId }).populate('avatar').exec()
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
    const hipoUserFromDb = await this.findUserByEmail(email);
    return !!Object.keys(hipoUserFromDb).length;
  }

  async getUserProfile(id: string, storedUser: any): Promise<UserToProfileDto> {
    const userFromDb = await this.findUserById(id);

    if (!userFromDb) {
      throw new BadRequestException('User with that id doesnt exist');
    }

    try {
      const amIOwner: boolean =
        storedUser.userId.toString() === userFromDb._id.toString();

      const { passwordHash, passwordSalt, avatar, ...rest } = userFromDb;

      const avatarUrl = await this.fileServ.getSignedFileUrl(
        userFromDb?.avatar?.key,
      );

      const userToProfileDto: UserToProfileDto = {
        amIOwner,
        avatarUrl,
        ...rest,
      };

      return userToProfileDto;
    } catch (e) {
      throw new InternalServerErrorException(
        'Error occured during retriving data',
      );
    }
  }

  async updateUserInfo(
    userIdFromParams: string,
    userId: string,
    role: string,
    userToUpdateDto: UserToUpdateDto,
  ): Promise<SignedFileUrlDto> {
    let updatedUser;
    const userFromDb = await this.findUserById(userId);
    if (
      !Object.keys(userFromDb).length ||
      userIdFromParams.toString() !== userId.toString()
    ) {
      throw new ForbiddenException('You are not allowed to do this');
    }

    try {
      let avatarToUpdate;
      if (userToUpdateDto.avatarToUpload && userToUpdateDto.avatarName) {
        await this.fileServ.deleteFile(userFromDb.avatar?.key);
        avatarToUpdate = await this.fileServ.uploadFile(
          userToUpdateDto.avatarToUpload,
          userToUpdateDto.avatarName,
        );
      } else avatarToUpdate = userFromDb.avatar;

      if (role === Roles.DEVELOPER) {
        updatedUser = await this.developerModel.findOneAndUpdate(
          { _id: userId },
          {
            avatar: avatarToUpdate,
            ...userToUpdateDto,
          },
        );
      } else if (role === Roles.HUNTER) {
        updatedUser = await this.hunterModel.findOneAndUpdate(
          { _id: userId },
          {
            avatar: avatarToUpdate,
            ...userToUpdateDto,
          },
        );
      }

      const signedFileUrl: string = await this.fileServ.getSignedFileUrl(
        avatarToUpdate?.key,
      );

      return { signedFileUrl };
    } catch (e) {
      throw new InternalServerErrorException(
        'Error occured during saving photo',
      );
    }
  }

  async getUserChatList(query: UserChatListParamsDto): Promise<Array<any>> {
    const attributesToSelect = { _id: 1, name: 1, surname: 1 };
    const developersFromDb = await this.developerModel
      .find({})
      .select(attributesToSelect)
      .populate('avatar');
    const huntersFromDb = await this.hunterModel
      .find({})
      .select(attributesToSelect)
      .populate('avatar');
    const resultArray = JSON.parse(
      JSON.stringify([...developersFromDb, ...huntersFromDb]),
    );

    resultArray.forEach(async (el) => {
      if (!el?.avatar) {
        el.avatar = { url: UsersService.DEFAULT_IMAGE_LINK };
      } else {
        const signedUrlForFile = await this.fileServ.getSignedFileUrl(
          el.avatar.key,
        );
        el.avatar = { url: signedUrlForFile };
      }
    });

    return resultArray;
  }
}
