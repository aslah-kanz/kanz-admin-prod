import { TImage } from './image.type';

export type TSettingWebsite = {
  id: number;
  code: string;
  siteName: string;
  metaDescription: string;
  metaKeyword: string;
  logo: TImage;
  favicon: TImage;
  instagram: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  phoneNumber: string;
  email: string;
  address: string;
};
