import { STATUS, TLocale, TLocaleRequest, TMeta } from './common.type';
import { TImage } from './image.type';

export type TBrand = {
  id: number;
  name: TLocale;
  slug: string;
  image: TImage;
  bwImage: TImage;
  description: TLocale;
};

export type TBrandDetail = TBrand &
  TMeta & {
    code: string;
    showAtHomePage: true;
    status: STATUS;
    categoryIds: Array<number>;
  };

export type TBrandRequest = {
  code?: string;
  name: TLocaleRequest;
  slug: string;
  imageId?: number;
  bwImageId?: number;
  description?: TLocaleRequest;
  metaKeyword?: string;
  metaDescription?: string;
  showAtHomePage: boolean;
  status: string;
  categoryIds: Array<number>;
};

export type TBrandParams = {
  size?: string | undefined;
  page?: string | undefined;
  order?: string | undefined;
  sort?: string | undefined;
  search?: string | undefined;
};
