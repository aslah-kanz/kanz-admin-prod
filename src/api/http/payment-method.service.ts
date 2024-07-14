'use server';

import http from '@/lib/axios-instance';
import { TApiResponse } from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import {
  TPaymentMethod,
  TPaymentMethodRequest,
} from '@/types/payment-method.type';

/**
 * get payment methods
 * @returns
 */
export const getPaymentMethods = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponse<TPaymentMethod[]>>(
    `/payment-methods`,
    { params },
  );

  return data.data;
};

/**
 * get payment method by id
 * @param id
 * @returns
 */
export const getPaymentMethodById = async (id: number) => {
  const { data } = await http.get<TApiResponse<TPaymentMethod>>(
    `/payment-methods/${id}`,
  );

  return data.data;
};

/**
 * Add payment method
 * @param payload
 * @returns
 */
export const addPaymentMethod = async (payload: TPaymentMethodRequest) => {
  const { data } = await http.post<TApiResponse<TPaymentMethod>>(
    '/payment-methods',
    payload,
  );

  return data;
};

/**
 * Update payment method
 * @param id
 * @param payload
 * @returns
 */
export const editPaymentMethod = async (
  id: number,
  payload: TPaymentMethodRequest,
) => {
  const { data } = await http.put<TApiResponse<TPaymentMethod>>(
    `/payment-methods/${id}`,
    payload,
  );

  return data;
};

/**
 * Delete paymentMethod
 * @param id
 * @returns
 */
export const deletePaymentMethod = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TPaymentMethod>>(
    `/payment-methods/${id}`,
  );

  return data;
};
