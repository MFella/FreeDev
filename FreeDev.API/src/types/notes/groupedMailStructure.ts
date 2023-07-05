import { Mail } from 'src/mail/mail.schema';
import { FolderType } from './folderType';

export type GroupedMailStructure = Partial<{
  [key in FolderType]: Array<Mail>;
}>;
