'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import {
  TUpdateStatusWithdraw,
  TWithdraw,
  TWithdrawDetail,
} from '@/types/withdraw.type';

/**
 * Get withdraws
 * @returns
 */
export const getWithdraws = async () => {
  const { data } = await http.get<TApiResponsePaginate<TWithdraw>>(
    'https://private-baae6c-zulfianfachrureza.apiary-mock.com/admin/withdraws',
  );

  return data.data;
};

/**
 * Get withdraw by id
 * @param id
 * @returns
 */
export const getWithdrawById = async (id: number) => {
  const { data } = await http.get<TApiResponse<TWithdrawDetail>>(
    `https://private-baae6c-zulfianfachrureza.apiary-mock.com/admin/withdraws/${id}`,
  );

  return data.data;
};

/**
 * Update status withdraw
 * @param id
 * @param payload
 * @returns
 */
export const updateStatusWithdraw = async (
  id: number,
  payload: TUpdateStatusWithdraw,
) => {
  const { data } = await http.put<TApiResponse<{}>>(`/${id}`, payload);

  return data;
};

/**
 * Export withdraw
 * @param params
 * @returns
 */
export const exportWithdraw = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponse<{ url: string }>>('/', {
    params,
  });

  return data;
};
