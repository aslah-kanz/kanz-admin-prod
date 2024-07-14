'use server';

import http from '@/lib/axios-instance';
import {
  TApiResponse,
  TApiResponsePaginate,
  TApiSearchParams,
} from '@/types/api.type';
import { TBankAdd, TBankList } from '@/types/bank.type';

export const getAllBank = async (query: Partial<TApiSearchParams>) => {
  const { page = 1, search = '', size = 56 } = query;

  const queryString = new URLSearchParams({
    page: (page - 1).toString(),
    search,
    size: size.toString(),
  });

  const { data } = await http.get<TApiResponsePaginate<TBankList>>(
    `/principal-banks?${queryString}`,
  );

  return data.data;
};

export const addBank = async (payload: TBankAdd) => {
  const { data } = await http.post<TApiResponse<TBankList>>(
    `/principal-banks`,
    payload,
  );
  return data;
};

export const editBank = async (payload: TBankAdd, id: number) => {
  const { data } = await http.put<TApiResponse<TBankList>>(
    `/principal-banks/${id}`,
    payload,
  );
  return data;
};

export const deleteBank = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TBankList>>(
    `/principal-banks/${id}`,
  );
  return data;
};
