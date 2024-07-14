import { TLocale, TLocaleRequest, TMeta } from './common.type';
import { TImage } from './image.type';

export type TCategory = {
  id: number;
  parentId: string;
  name: TLocale;
  slug: string;
  image: TImage | null;
  description: TLocale | null;
};

export type TCategoryDetail = TCategory &
  TMeta & {
    code: string;
    showAtHomePage: true;
    status: string;
  };

export type TCategoryRequest = {
  parentId?: number | null;
  code?: string | null;
  name: TLocaleRequest;
  slug: string;
  imageId?: number | null;
  description?: TLocaleRequest;
  metaKeyword?: string | null;
  metaDescription?: string | null;
  showAtHomePage: boolean;
  status: string;
};

export type TCategoryParams = {
  size?: string | undefined;
  page?: string | undefined;
  order?: string | undefined;
  sort?: string | undefined;
  parentId?: string | undefined;
  search?: string | undefined;
  showAtHomePage?: Date | undefined;
};
