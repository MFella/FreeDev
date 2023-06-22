import {IsEnum, IsString} from "class-validator";
import {FolderType} from "../../types/notes/folderType";

export class MoveMailDto {

    @IsString()
    mailId: string;

    @IsEnum(FolderType, {each: true})
    targetFolder: FolderType;
}