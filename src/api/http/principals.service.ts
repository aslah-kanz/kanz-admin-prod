'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import { TPrincipal } from '@/types/principal.type';

export const getPrincipalList = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponsePaginate<TPrincipal>>(
    `/principals`,
    {
      params,
    },
  );
  return data.data;
};

export const getPrincipalById = async (principalId: string) => {
  const { data } = await http.get<TApiResponse<TPrincipal>>(
    `/principals/${principalId}`,
  );

  return data.data;
};

export const deletePrincipal = async (id: number) => {
  const { data } = await http.delete<TApiResponse<{}>>(`/principals/${id}`);
  return data;
};

export const addPrincipal = async (payload: TPrincipal) => {
  const { data } = await http.post<TApiResponse<{}>>(`/principals`, payload);
  return data;
};

export const updatePrincipal = async (payload: TPrincipal, id: number) => {
  const { data } = await http.put<TApiResponse<{}>>(
    `/principals/${id}`,
    payload,
  );
  return data;
};

export const approvePrincipal = async (id: number) => {
  const { data } = await http.post<TApiResponse<{}>>(
    `/principals/${id}/approve`,
  );
  return data;
};

export const rejectPrincipal = async (id: number) => {
  const { data } = await http.post<TApiResponse<{}>>(
    `/principals/${id}/reject`,
  );
  return data;
};
