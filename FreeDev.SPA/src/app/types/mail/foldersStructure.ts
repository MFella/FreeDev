import { FolderType } from './folderType';

export type FoldersStructure = {
  folderTypes: FolderTypes;
};

export type FolderTypes = {
  [key in FolderType as Uppercase<key>]: FolderStructure;
};

export type FolderStructure = {
  type: FolderType;
  totalCount: number;
  readCount: number;
};
