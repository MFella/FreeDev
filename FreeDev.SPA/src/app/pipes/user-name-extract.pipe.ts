import {Pipe, PipeTransform} from '@angular/core';
import {FolderMessageDto} from "../dtos/notes/folderMessageDto";

@Pipe({
  name: 'userNameExtract'
})
export class UserNameExtractPipe implements PipeTransform {

  transform(folderMessageDto: FolderMessageDto): string {
    if (folderMessageDto.receiverId) {
      return folderMessageDto.receiverId.name + ' ' + folderMessageDto.receiverId.surname;
    }

    if (folderMessageDto.senderId) {
      return folderMessageDto.senderId.name + ' ' + folderMessageDto.senderId.surname;
    }
    return '';
  }

}
