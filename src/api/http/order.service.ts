'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import { TOrder, TOrderDetail } from '@/types/order.type';

/**
 * Get orders
 * @returns
 */
export const getOrders = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponsePaginate<TOrder>>(
    '/admin/orders',
    { params },
  );

  return data.data;
};

/**
 * Get order by id
 * @param id
 * @returns
 */
export const getOrderById = async (id: number) => {
  const { data } = await http.get<TApiResponse<TOrderDetail>>(
    `/admin/orders/${id}`,
  );

  return data.data;
};

/**
 * Download list order
 * @param params
 * @returns
 */
export const downloadListOrder = async (params?: TDefaultSearchParams) => {
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
export const downloadPdfOrdder = async (id: number) => {
  const { data } = await http.get<TApiResponse<{ url: string }>>(`/${id}`);

  return data;
};

/**
 * Delete order
 * @param id
 * @returns
 */
export const deleteOrder = async (id: string) => {
  const { data } = await http.delete<TApiResponse<TOrderDetail>>(
    `/admin/orders/${id}`,
  );

  return data;
};

/**
 * Cancel order
 * @param id
 * @returns
 */
export const cancelOrder = async (id: string) => {
  const { data } = await http.post<TApiResponse<TOrderDetail>>(
    `/admin/orders/${id}/cancel`,
  );

  return data;
};

/**
 * Complete order
 * @param id
 * @returns
 */
export const completeOrder = async (id: string) => {
  const { data } = await http.put<TApiResponse<TOrderDetail>>(
    `/admin/orders/${id}/complete`,
  );

  return data;
};
