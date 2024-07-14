import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import {
  TExchangeItem,
  TExchangeParams,
  TExchangeActionPayload,
} from '@/types/exchange.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  getExchangeById,
  getExchanges,
  rejectExchange,
  approveExchange,
} from './http/exchange.service';

/**
 * Get exchangess
 * @param opt
 * @returns
 */
export const useGetExchanges = (
  params?: TExchangeParams,
  opt?: QueryObserverOptions<TResponsePaginate<TExchangeItem>>,
) => {
  return useQuery<TResponsePaginate<TExchangeItem>, ApiServiceErr>(
    ['exchanges'],
    () => getExchanges(params),
    opt,
  );
};

/**
 * Get exchange by id
 * @param id
 * @param opt
 * @returns
 */
export const useGetExchangeById = (
  id: string,
  opt?: QueryObserverOptions<TExchangeItem>,
) => {
  return useQuery<TExchangeItem, ApiServiceErr>(
    ['exchanges', { id }],
    () => getExchangeById(id),
    opt,
  );
};

/**
 * Confirm
 * @param opt
 * @returns
 */
export const useApproveExchange = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<
    TApiResponse<{}>,
    ApiServiceErr,
    { id: string; payload: TExchangeActionPayload }
  >(async ({ id, payload }) => {
    const resp = await approveExchange(id, payload);
    return resp;
  }, opt);
};

export const useRejectExchange = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<
    TApiResponse<{}>,
    ApiServiceErr,
    { id: string; payload: TExchangeActionPayload }
  >(async ({ id, payload }) => {
    const resp = await rejectExchange(id, payload);
    return resp;
  }, opt);
};
