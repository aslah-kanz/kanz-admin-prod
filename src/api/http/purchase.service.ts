'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import { TPurchase, TPurchaseDetail } from '@/types/purchase.type';

/**
 * Get purchases
 * @returns
 */
export const getPurchases = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponsePaginate<TPurchase>>(
    'admin/orders/stores',
    { params },
  );

  return data.data;
};

/**
 * Get purchase by id
 * @returns
 */
export const getPurchaseById = async (id: number) => {
  const { data } = await http.get<TApiResponse<TPurchaseDetail>>(
    `admin/orders/stores/${id}`,
  );

  return data.data;
};

/**
 * Download list purchase
 * @param params
 * @returns
 */
export const downloadListPurchase = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponse<{ url: string }>>('/', {
    params,
  });

  return data;
};

/**
 * Download pdf
 * @param id
 * @returns
 */
export const downloadPdfPurchase = async (id: number) => {
  const { data } = await http.get<TApiResponse<{ url: string }>>(`/${id}`);

  return data;
};

/**
 * Assign to vendor
 * @param id
 * @returns
 */
export const assignToVendor = async (id: number) => {
  const { data } = await http.post<TApiResponse<{}>>(`/${id}`);

  return data;
};

/**
 * Delete purchase
 * @param id
 * @returns
 */
export const deletePurchase = async (id: number) => {
  const { data } = await http.delete<TApiResponse<{}>>(`/${id}`);

  return data;
};

/**
 * Cancel purchase
 * @param id
 * @returns
 */
export const cancelPurchase = async (id: number) => {
  const { data } = await http.put<TApiResponse<{}>>(`/${id}`);

  return data;
};

/**
 * Complete purchase
 * @param id
 * @returns
 */
export const completePurchase = async (id: number) => {
  const { data } = await http.put<TApiResponse<{}>>(`/${id}`);

  return data;
};
