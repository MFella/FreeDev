export interface OfferDetailsDto {
  _id: string;
  appliedDevelopers: Array<string>;
  createdAt: string;
  experienceLevel: string;
  salary: number;
  tags: Array<string>;
  title: string;
  description: string;
  createdBy: UserToOfferDetail;
}

export interface UserToOfferDetail {
  name: string;
  surname: string;
  _id: string;
  nameOfCompany: string;
}
