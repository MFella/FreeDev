export interface NavLinkItem {
  label: string;
  icon: string;
  routerLink?: string;
  styleCss?: string;
  items?: Array<NavLinkDropdownItem>;
}

export interface NavLinkDropdownItem {
  label: string;
  icon: string;
  routerLink?: string;
  command?: () => void;
}
