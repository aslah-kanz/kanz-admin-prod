import { TLocale, TLocaleRequest, TMeta, TMetaRequest } from './common.type';
import { TImage } from './image.type';

export type TBlog = TMeta & {
  id: number;
  code: string;
  title: TLocale;
  slug: string;
  image: TImage;
  description: TLocale;
  updatedAt: Date;
};

export type TBlogDetail = TBlog;

export type TBlogRequest = TMetaRequest & {
  title: TLocaleRequest;
  slug: string;
  imageId: number;
  description: TLocaleRequest;
};
