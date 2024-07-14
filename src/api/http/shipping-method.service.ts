'use server';

import http from '@/lib/axios-instance';
import { TApiResponse } from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import {
  TShippingMethod,
  TShippingMethodRequest,
} from '@/types/shipping-method.type';

/**
 * get shipping methods
 * @returns
 */
export const getShippingMethods = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponse<TShippingMethod[]>>(
    `/shipping-methods`,
    { params },
  );

  return data.data;
};

/**
 * get shipping method by id
 * @param id
 * @returns
 */
export const getShippingMethodById = async (id: number) => {
  const { data } = await http.get<TApiResponse<TShippingMethod>>(
    `/shipping-methods/${id}`,
  );

  return data.data;
};

/**
 * Add shipping method
 * @param payload
 * @returns
 */
export const addShippingMethod = async (payload: TShippingMethodRequest) => {
  const { data } = await http.post<TApiResponse<TShippingMethod>>(
    '/shipping-methods',
    payload,
  );

  return data;
};

/**
 * Update shipping method
 * @param id
 * @param payload
 * @returns
 */
export const editShippingMethod = async (
  id: number,
  payload: TShippingMethodRequest,
) => {
  const { data } = await http.put<TApiResponse<TShippingMethod>>(
    `/shipping-methods/${id}`,
    payload,
  );

  return data;
};

/**
 * Delete shipping method
 * @param id
 * @returns
 */
export const deleteShippingMethod = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TShippingMethod>>(
    `/shipping-methods/${id}`,
  );

  return data;
};
