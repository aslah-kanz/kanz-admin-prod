import { TLocale } from './common.type';
import { TImage } from './image.type';

export type TLanguage = {
  id: number;
  code: string;
  name: TLocale;
  image: TImage;
  createdAt: string;
  updatedAt: string;
};
