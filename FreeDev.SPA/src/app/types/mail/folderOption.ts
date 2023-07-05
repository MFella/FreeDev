import {FolderType} from "./folderType";

export class FolderOption {
  constructor(
    private readonly folderType: FolderType
  ) {
  }

  get type(): FolderType {
    return this.folderType;
  }

  isEqual(folderType: FolderType): boolean {
    return this.folderType === folderType;
  }
}
