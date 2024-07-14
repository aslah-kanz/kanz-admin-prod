import { TLocale, TLocaleRequest } from './common.type';
import { TImage } from './image.type';

export type TCountry = {
  id: number;
  code: string;
  name: TLocale;
  phoneCode: number;
  phoneStartNumber: number;
  phoneMinLength: number;
  phoneMaxLength: number;
  image: TImage;
  createdAt: Date;
  updatedAt: Date;
};

export type TCountryDetail = TCountry;

export type TCountryRequest = {
  code: string;
  name: TLocaleRequest;
  phoneCode: number;
  phoneStartNumber: number;
  phoneMinLength: number;
  phoneMaxLength: number;
  imageId: number;
};
