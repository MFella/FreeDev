import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
import { UserChatListParamsDto } from 'src/dtos/userChatListParamsDto';
import { RoomKey, RoomKeyDocument } from 'src/messages/room-key.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Developer.name)
    private developerModel: Model<DeveloperDocument>,
    @InjectModel(Hunter.name)
    private hunterModel: Model<HunterDocument>,
    @InjectModel(RoomKey.name)
    private readonly roomKeyModel: Model<RoomKeyDocument>,
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

  async getUserChatList(
    query: UserChatListParamsDto,
  ): Promise<{ result: Array<any>; numberOfTotalRecords: number }> {
    const attributesToSelect = { _id: 1, name: 1, surname: 1 };
    const developersFromDb = await this.developerModel
      .find({})
      // .limit(Number(query.perPage))
      // .skip(Number(query.pageNo) * Number(query.perPage))
      .select(attributesToSelect)
      .populate('avatar');

    const huntersFromDb = await this.hunterModel
      .find({})
      // .limit(Number(query.perPage))
      // .skip(Number(query.pageNo) * Number(query.perPage))
      .select(attributesToSelect)
      .populate('avatar');

    let resultArray = JSON.parse(
      JSON.stringify([...developersFromDb, ...huntersFromDb]),
    );

    resultArray = this.paginate(
      resultArray,
      Number(query.perPage),
      Number(query.pageNo),
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

    const numberOfTotalRecords: number =
      <number>await this.hunterModel.count() +
      <number>await this.developerModel.count();

    return { result: resultArray, numberOfTotalRecords };
  }

  async getFilteredUserChatList(
    query: any,
  ): Promise<{ result: Array<any>; numberOfTotalRecords: number }> {
    const attributesToSelect = { _id: 1, name: 1, surname: 1 };
    let usersToReturn = [];
    let numberOfTotalRecords: number = 0;
    const lengthOfHunter = !!query.name.trim().length
      ? await this.hunterModel
          .find({
            name: query.name,
          })
          .count()
      : await this.hunterModel.find({}).count();

    const lengthOfDeveloper = !!query.name.trim().length
      ? await this.developerModel
          .find({
            name: query.name.trim(),
          })
          .count()
      : await this.developerModel.find({}).count();

    const huntersFromDb = !!query.name.trim().length
      ? await this.hunterModel
          .find({
            name: query.name,
          })
          .select(attributesToSelect)
      : await this.hunterModel.find({}).select(attributesToSelect);

    const developersFromDb = !!query.name.trim().length
      ? await this.developerModel
          .find({
            name: query.name.trim(),
          })
          .select(attributesToSelect)
      : await this.developerModel.find({}).select(attributesToSelect);

    switch (query.typeOfUser) {
      case 'DEVELOPER':
        usersToReturn = developersFromDb;
        numberOfTotalRecords = lengthOfDeveloper;
        break;
      case 'HUNTER':
        usersToReturn = huntersFromDb;
        numberOfTotalRecords = lengthOfHunter;
        break;
      case 'BOTH':
        usersToReturn = [...huntersFromDb, ...developersFromDb];
        numberOfTotalRecords = lengthOfDeveloper + lengthOfHunter;
        console.log('asdfasfas', numberOfTotalRecords);
        break;
      default:
        break;
    }

    let resultArray = JSON.parse(JSON.stringify([...usersToReturn]));

    resultArray = this.paginate(
      resultArray,
      Number(query.perPage),
      Number(query.pageNo),
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

    console.log('results: ', resultArray);
    console.log('query ', query);

    return {
      result: resultArray,
      numberOfTotalRecords,
    };
  }

  async getUserKeyRoom(senderId: string, receiverId: string): Promise<any> {
    const receiverFromDb = await this.findUserById(receiverId);
    if (!Object.values(receiverFromDb)) {
      throw new NotFoundException('User with that id doesnt exists');
    }

    try {
      const roomKeyFromDb = await this.roomKeyModel
        .findOne({ userIds: [senderId, receiverId] })
        .select({ key: 1 });

      const revertedKeyFromDb = await this.roomKeyModel
        .findOne({ userIds: [receiverId, senderId] })
        .select({ key: 1 });

      if (!roomKeyFromDb && !revertedKeyFromDb) {
        const keyToSave = this.generateKey();

        const modelToSave = {
          userIds: [senderId, receiverId],
          key: keyToSave,
        };

        await this.roomKeyModel.create(modelToSave);

        return { key: keyToSave };
      }

      if (roomKeyFromDb) return { key: roomKeyFromDb.key };

      if (revertedKeyFromDb) return { key: revertedKeyFromDb.key };

      return { key: '' };
    } catch (e) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  private paginate(
    arrayToPaginate: Array<any>,
    perPage: number,
    pageNo: number,
  ): Array<any> {
    return arrayToPaginate.slice(pageNo * perPage, (pageNo + 1) * perPage);
  }

  private generateKey() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }
}
