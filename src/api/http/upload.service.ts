'use server';

import http from '@/lib/axios-instance';
import { TApiResponse } from '@/types/api.type';
import { TImage } from '@/types/common.type';

/**
 * Add Product by id
 * @param id
 * @returns
 */
export const uploadFileSingle = async (_payload: FormData) => {
  const { data: _data } = await http.post<TApiResponse<TImage>>(
    `https://private-f762d7-kanzway2.apiary-mock.com/v1/vendor/products`,
    // ENABLE SOON
    // payload,
  );
  return {
    code: 0,
    message: null,
    data: {
      id: 1,
      name: 'dormer',
      url: 'https://images.unsplash.com/photo-1605701249987-f0bb9b505d06?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      width: 800,
      height: 600,
      type: 'image',
    },
    timestamp: '2024-01-25 10:10:10',
  };
};
