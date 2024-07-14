import { TLocale } from './common.type';
import { TImage } from './image.type';

export type TCertification = {
  id: number;
  code: string;
  title: TLocale;
  slug: string;
  image: TImage;
  updatedAt: Date;
  status: 'draft' | 'published';
};

export type TCertificationDetail = TCertification;

// export type TCertificationPayload = {
//   id?: number;
//   title: TLocale;
//   file: File;
//   status?: string;
// };
export type TCertificationPayload = FormData;

export type TCertificationParams = {
  size?: string | undefined;
  page?: string | undefined;
  order?: string | undefined;
  sort?: string | undefined;
  search?: string | undefined;
};
