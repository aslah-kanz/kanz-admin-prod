'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import {
  TExchangeItem,
  TExchangeActionPayload,
  TExchangeParams,
} from '@/types/exchange.type';

/**
 * Get exchanges
 * @returns
 */
export const getExchanges = async (params?: TExchangeParams) => {
  const { data } = await http.get<TApiResponsePaginate<TExchangeItem>>(
    '/admin/exchanges',
    { params },
  );

  return data.data;
};

/**
 * Get exchange by id
 * @param id
 * @returns
 */
export const getExchangeById = async (id: string) => {
  const { data } = await http.get<TApiResponse<TExchangeItem>>(
    `/admin/exchanges/${id}`,
  );

  return data.data;
};

/**
 * Confirm exchange
 * @returns
 */
export const approveExchange = async (
  id: string,
  payload: TExchangeActionPayload,
) => {
  const { data } = await http.post<TApiResponse<{}>>(
    `/admin/exchanges/${id}/approve`,
    payload,
  );

  return data;
};

/**
 * Reject refund
 * @returns
 */
export const rejectExchange = async (
  id: string,
  payload: TExchangeActionPayload,
) => {
  const { data } = await http.post<TApiResponse<{}>>(
    `/admin/exchanges/${id}/reject`,
    payload,
  );

  return data;
};
