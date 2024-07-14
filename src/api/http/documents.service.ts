'use server';

import http from '@/lib/axios-instance';
import { TApiResponse } from '@/types/api.type';
import { TDocument } from '@/types/bank.type';

export const uploadDocument = async (payload: FormData) => {
  const { data } = await http.postForm<TApiResponse<TDocument>>(
    `/documents`,
    payload,
  );
  return data;
};
