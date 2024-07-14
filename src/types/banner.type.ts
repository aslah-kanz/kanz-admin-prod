import { TLocale } from './common.type';
import { TImage } from './image.type';

export type TBanner = {
  id: number;
  code: string;
  title: TLocale;
  url: string;
  image: TImage;
  description: TLocale;
  updatedAt: string;
  status?: string;
};

export type TBannerPayload = {
  title: TLocale;
  titleEn?: string;
  titleAr?: string;
  link: string;
  imageId: number;
  description: TLocale;
  descriptionEN?: string;
  descriptionAr?: string;
  status: string;
  file?: File;
};

export type TBannerForm = {
  titleEn: string;
  titleAr: string;
  link: string;
  imageId: number;
  descriptionEn: string;
  descriptionAr: string;
  status: string;
  file?: File;
};
