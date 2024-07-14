export type TImage = {
  id: number;
  name: string;
  url: string;
  width: number;
  height: number;
  type: 'image';
};

export type TUploadImage = {
  file: File;
  name: string;
};
