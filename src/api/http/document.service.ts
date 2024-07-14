'use server';

import http from '@/lib/axios-instance';
import { TApiResponse } from '@/types/api.type';
import { TDocument } from '@/types/document.type';

/**
 * Upload image
 * @param image
 * @param name
 * @returns
 */
export const uploadDocument = async (payload: FormData) => {
  const { data } = await http.post<TApiResponse<TDocument>>(
    '/documents',
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return data;
};

/**
 * Delete image
 * @param id
 * @returns
 */
export const deleteDocument = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TDocument>>(
    `/documents/${id}`,
  );

  return data;
};

export const downloadDocument = async (name: string) => {
  const data = await http.get<Buffer>(`/documents/download/${name}`);
  return data;
};
