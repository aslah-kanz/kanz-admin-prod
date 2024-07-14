import { ApiServiceErr, MutOpt, TApiResponse } from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import {
  TShippingMethod,
  TShippingMethodRequest,
} from '@/types/shipping-method.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  addShippingMethod,
  deleteShippingMethod,
  editShippingMethod,
  getShippingMethodById,
  getShippingMethods,
} from './http/shipping-method.service';

/**
 * Get shipping methods
 * @param opt
 * @returns
 */
export const useGetShippingMethods = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TShippingMethod[]>,
) => {
  return useQuery<TShippingMethod[], ApiServiceErr>(
    ['shipping-methods', params],
    () => getShippingMethods(params),
    opt,
  );
};

/**
 * Get shipping method by id
 * @param id
 * @param opt
 * @returns
 */
export const useGetShippingMethodById = (
  id: number,
  opt?: QueryObserverOptions<TShippingMethod>,
) => {
  return useQuery<TShippingMethod, ApiServiceErr>(
    ['shipping-methods', { id }],
    () => getShippingMethodById(id),
    opt,
  );
};

/**
 * Add shipping method
 * @param opt
 * @returns
 */
export const useAddShippingMethod = (
  opt?: MutOpt<TApiResponse<TShippingMethod>>,
) => {
  return useMutation<
    TApiResponse<TShippingMethod>,
    ApiServiceErr,
    TShippingMethodRequest
  >(async (payload) => {
    const resp = await addShippingMethod(payload);
    return resp;
  }, opt);
};

/**
 * Update shipping method
 * @param opt
 * @returns
 */
export const useEditShippingMethod = (
  opt?: MutOpt<TApiResponse<TShippingMethod>>,
) => {
  return useMutation<
    TApiResponse<TShippingMethod>,
    ApiServiceErr,
    { id: number; payload: TShippingMethodRequest }
  >(async ({ id, payload }) => {
    const resp = await editShippingMethod(id, payload);
    return resp;
  }, opt);
};

/**
 * Delete shipping method
 * @param opt
 * @returns
 */
export const useDeleteShippingMethod = (
  opt?: MutOpt<TApiResponse<TShippingMethod>>,
) => {
  return useMutation<TApiResponse<TShippingMethod>, ApiServiceErr, number>(
    async (id) => {
      const resp = await deleteShippingMethod(id);
      return resp;
    },
    opt,
  );
};
