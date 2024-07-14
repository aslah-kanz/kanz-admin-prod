import { TImage } from './image.type';

export type TNotification = {
  id: number;
  title: string;
  message: string;
  image: TImage;
  type: string;
  referenceId: 1;
  createdAt: string;
  readAt: string | null;
};
