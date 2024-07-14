import { STATUS, TLocale, TLocaleRequest } from './common.type';
import { TImage } from './image.type';

export type TWebPage = {
  id: number;
  code: string;
  title: TLocale;
  slug: string;
  image: TImage;
  metaKeyword: string;
  metaDescription: string;
  showAtHomePage: boolean;
  status: STATUS;
  contents: Array<TLocale>;
};

export type TWebPageRequest = {
  title: TLocaleRequest;
  slug: string;
  imageId: number | null;
  metaKeyword: string;
  metaDescription: string;
  showAtHomePage: boolean;
  status: STATUS;
  contents: Array<TLocaleRequest>;
};
