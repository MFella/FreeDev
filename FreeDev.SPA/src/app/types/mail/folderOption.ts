import { FolderType } from './folderType';

export class FolderOption {
  constructor(
    private readonly folderType: FolderType,
    private readonly totalCount?: number | undefined,
    private readonly readCount?: number | undefined
  ) {}

  get type(): FolderType {
    return this.folderType;
  }

  isEqual(folderType: FolderType): boolean {
    return this.folderType === folderType;
  }

  getTotalCount(): number | undefined {
    return this.totalCount;
  }

  getReadCount(): number | undefined {
    return this.readCount;
  }

  getFolderType(): FolderType {
    return this.folderType;
  }
}
