import {
  ApiServiceErr,
  TResponsePaginate,
  TApiResponse,
  MutOpt,
} from '@/types/api.type';
import {
  TRefundActionPayload,
  TRefundItem,
  TRefundParams,
} from '@/types/refund.type';
import { QueryObserverOptions, useQuery, useMutation } from 'react-query';
import {
  getRefundById,
  getRefunds,
  approveRefund,
  rejectRefund,
} from './http/refund.service';

/**
 * Get refunds
 * @param opt
 * @returns
 */
export const useGetRefunds = (
  params?: TRefundParams,
  opt?: QueryObserverOptions<TResponsePaginate<TRefundItem>>,
) => {
  return useQuery<TResponsePaginate<TRefundItem>, ApiServiceErr>(
    ['refunds', params],
    () => getRefunds(params),
    opt,
  );
};

/**
 * Get refund by id
 * @param id
 * @param opt
 * @returns
 */
export const useGetRefundById = (
  id: string,
  opt?: QueryObserverOptions<TRefundItem>,
) => {
  return useQuery<TRefundItem, ApiServiceErr>(
    ['refunds', { id }],
    () => getRefundById(id),
    opt,
  );
};

export const useApproveRefund = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<
    TApiResponse<{}>,
    ApiServiceErr,
    { id: string; payload: TRefundActionPayload }
  >(async ({ id, payload }) => {
    const resp = await approveRefund(id, payload);
    return resp;
  }, opt);
};

export const useRejectRefund = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<
    TApiResponse<{}>,
    ApiServiceErr,
    { id: string; payload: TRefundActionPayload }
  >(async ({ id, payload }) => {
    const resp = await rejectRefund(id, payload);
    return resp;
  }, opt);
};
