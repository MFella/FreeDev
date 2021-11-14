import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { S3 } from 'aws-sdk';
import { Model } from 'mongoose';
import { FileDocument } from './file.schema';
import { v4 as uuid } from 'uuid';
import { File } from './file.schema';

@Injectable()
export class FileService {
  private static readonly DEFAULT_IMAGE_LINK: string =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Placeholder_no_text.svg/1200px-Placeholder_no_text.svg.png';

  constructor(
    @InjectModel(File.name)
    private readonly fileModel: Model<FileDocument>,
    private readonly configServ: ConfigService,
  ) {}

  async uploadFile(dataBuffer: Buffer, fileName: string): Promise<any> {
    const s3 = new S3();
    const fileKey = `${uuid()}-${fileName}`;

    const uploadResult = await s3
      .upload({
        Bucket: this.configServ.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: Buffer.from((dataBuffer as any).data, 'binary'),
        Key: fileKey,
      })
      .promise();

    const fileToSave = {
      key: uploadResult.Key,
      url: uploadResult.Location,
      type: 'img',
    };
    const savedFile = await this.fileModel.create(fileToSave);
    return savedFile;
  }

  async getFile(fileKey: string): Promise<any> {
    const s3 = new S3();

    const bucketParams = {
      Bucket: this.configServ.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: fileKey,
    };
    const objectFromS3 = await s3.getObject(bucketParams).promise();

    console.log(objectFromS3);
    return objectFromS3;
  }

  async getSignedFileUrl(fileKey: string): Promise<string> {
    try {
      const signedFileUrl = await new S3().getSignedUrl('getObject', {
        Bucket: this.configServ.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: fileKey,
      });

      return signedFileUrl;
    } catch (e) {
      return FileService.DEFAULT_IMAGE_LINK;
    }
  }
}
