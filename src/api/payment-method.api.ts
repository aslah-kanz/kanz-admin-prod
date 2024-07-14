import { ApiServiceErr, MutOpt, TApiResponse } from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import {
  TPaymentMethod,
  TPaymentMethodRequest,
} from '@/types/payment-method.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  addPaymentMethod,
  deletePaymentMethod,
  editPaymentMethod,
  getPaymentMethodById,
  getPaymentMethods,
} from './http/payment-method.service';

/**
 * Get blogs
 * @param opt
 * @returns
 */
export const useGetPaymentMethods = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TPaymentMethod[]>,
) => {
  return useQuery<TPaymentMethod[], ApiServiceErr>(
    ['payment-methods', params],
    () => getPaymentMethods(params),
    opt,
  );
};

/**
 * Get paymentMethods by id
 * @param id
 * @param opt
 * @returns
 */
export const useGetPaymentMethodById = (
  id: number,
  opt?: QueryObserverOptions<TPaymentMethod>,
) => {
  return useQuery<TPaymentMethod, ApiServiceErr>(
    ['payment-methods', { id }],
    () => getPaymentMethodById(id),
    opt,
  );
};

/**
 * Add paymentMethods
 * @param opt
 * @returns
 */
export const useAddPaymentMethod = (
  opt?: MutOpt<TApiResponse<TPaymentMethod>>,
) => {
  return useMutation<
    TApiResponse<TPaymentMethod>,
    ApiServiceErr,
    TPaymentMethodRequest
  >(async (payload) => {
    const resp = await addPaymentMethod(payload);
    return resp;
  }, opt);
};

/**
 * Update paymentMethods
 * @param opt
 * @returns
 */
export const useEditPaymentMethod = (
  opt?: MutOpt<TApiResponse<TPaymentMethod>>,
) => {
  return useMutation<
    TApiResponse<TPaymentMethod>,
    ApiServiceErr,
    { id: number; payload: TPaymentMethodRequest }
  >(async ({ id, payload }) => {
    const resp = await editPaymentMethod(id, payload);
    return resp;
  }, opt);
};

/**
 * Delete paymentMethods
 * @param opt
 * @returns
 */
export const useDeletePaymentMethod = (
  opt?: MutOpt<TApiResponse<TPaymentMethod>>,
) => {
  return useMutation<TApiResponse<TPaymentMethod>, ApiServiceErr, number>(
    async (id) => {
      const resp = await deletePaymentMethod(id);
      return resp;
    },
    opt,
  );
};
