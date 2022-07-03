import {KindOfMail} from "../../create-mail/create-mail.component";

export class KindOfMailDropdownItem {
  constructor(
    private readonly name: string,
    private readonly kindOfMail: KindOfMail
  ) {
  }

  getKindOfMail(): KindOfMail {
    return this.kindOfMail;
  }
}
