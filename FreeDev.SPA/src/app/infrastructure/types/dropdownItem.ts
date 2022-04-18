export class DropdownItem {
  constructor(
    public readonly label: string,
    public readonly icon: string,
    public readonly command: () => void,
    public readonly disabled: boolean = false
  ) {}
}
