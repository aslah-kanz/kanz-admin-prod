import { TImage } from './image.type';

export type TCustomerProfile = {
  id?: number;
  type: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: number | string;
  phoneNumber: string;
  gender: string;
  birthDate: string;
  image?: TImage;
  file?: File;
  wallet?: number;
};

export type TProfileUpdate = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  profilePicture?: File;
};

export type TEditPassword = {
  currentPassword: string;
  newPassword: string;
};

export type TPrincipal = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  type: string | null;
};
