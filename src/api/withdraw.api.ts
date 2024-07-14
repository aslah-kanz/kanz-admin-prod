import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import {
  TUpdateStatusWithdraw,
  TWithdraw,
  TWithdrawDetail,
} from '@/types/withdraw.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  exportWithdraw,
  getWithdrawById,
  getWithdraws,
  updateStatusWithdraw,
} from './http/withdraw.service';

/**
 * Get withdraws
 * @param opt
 * @returns
 */
export const useGetWithdraws = (
  opt?: QueryObserverOptions<TResponsePaginate<TWithdraw>>,
) => {
  return useQuery<TResponsePaginate<TWithdraw>, ApiServiceErr>(
    ['withdraws'],
    () => getWithdraws(),
    opt,
  );
};

/**
 * Get withdraw by id
 * @param id
 * @param opt
 * @returns
 */
export const useGetWithdrawById = (
  id: number,
  opt?: QueryObserverOptions<TWithdrawDetail>,
) => {
  return useQuery<TWithdrawDetail, ApiServiceErr>(
    ['withdraws', { id }],
    () => getWithdrawById(id),
    opt,
  );
};

/**
 * Update status withdraw
 * @param opt
 * @returns
 */
export const useUpdateStatusWithdraw = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<
    TApiResponse<{}>,
    ApiServiceErr,
    { id: number; payload: TUpdateStatusWithdraw }
  >(async ({ id, payload }) => {
    const resp = await updateStatusWithdraw(id, payload);
    return resp;
  }, opt);
};

/**
 * Export withdraw
 * @param id
 * @param opt
 * @returns
 */
export const useExportWithdraw = (
  id: number,
  opt?: QueryObserverOptions<TApiResponse<{ url: string }>>,
) => {
  return useQuery<TApiResponse<{ url: string }>, ApiServiceErr>(
    ['export-withdraw', { id }],
    () => exportWithdraw(),
    opt,
  );
};
