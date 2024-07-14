'use server';

import http from '@/lib/axios-instance';
import { TApiResponse } from '@/types/api.type';
import { TImage } from '@/types/image.type';

/**
 * Upload image
 * @param image
 * @param name
 * @returns
 */
export const uploadImage = async (payload: FormData) => {
  const { data } = await http.post<TApiResponse<TImage>>('/images', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

/**
 * Delete image
 * @param id
 * @returns
 */
export const deleteImage = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TImage>>(`/images/${id}`);

  return data;
};
