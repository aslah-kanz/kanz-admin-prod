import { TLocale, TMeta } from './common.type';
import { TImage } from './image.type';

export type TCatalogue = {
  id: number;
  code: string;
  title: TLocale;
  slug: string;
  date: string | Date;
  image: TImage;
  document: {
    id: number;
    name: string;
    url: string;
    type: string;
  };
  description: TLocale;
  readCount: number;
};

export type TCatalogueDetail = TCatalogue &
  TMeta & {
    code: string;
    showAtHomePage: true;
    status: string;
  };

export type TCataloguePayload = {
  id?: number;
  title: TLocale;
  slug: string;
  description: TLocale;
  metaDescription: string;
  metaKeyword: string;
  imageId: number;
  documentId: number;
  status: 'draft' | 'publish';
};

export type TCatalogueParams = {
  size?: string | undefined;
  page?: string | undefined;
  order?: string | undefined;
  sort?: string | undefined;
  parentId?: string | undefined;
  search?: string | undefined;
};
