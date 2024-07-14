import { ApiServiceErr, MutOpt, TApiResponse } from '@/types/api.type';
import { TImage } from '@/types/image.type';
import { useMutation } from 'react-query';
import { deleteImage, uploadImage } from './http/image.service';

/**
 * Upload image
 * @param opt
 * @returns
 */
export const useUploadImage = (opt?: MutOpt<TApiResponse<TImage>>) => {
  return useMutation<TApiResponse<TImage>, ApiServiceErr, FormData>(
    async (payload) => {
      const resp = await uploadImage(payload);
      return resp;
    },
    opt,
  );
};

/**
 * Delete image
 * @param opt
 * @returns
 */
export const useDeleteImage = (opt?: MutOpt<TApiResponse<TImage>>) => {
  return useMutation<TApiResponse<TImage>, ApiServiceErr, number>(
    async (id) => {
      const resp = await deleteImage(id);
      return resp;
    },
    opt,
  );
};
