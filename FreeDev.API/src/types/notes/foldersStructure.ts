import { FolderType } from './folderType';

export type FoldersStructure = {
  folderTypes: FolderStructureTypes;
};

export type FolderStructureTypes = {
  [key in FolderType as Uppercase<key>]: FolderStructure;
};

export type FolderStructure = {
  type: FolderType;
  totalCount: number;
  readCount: number;
};
