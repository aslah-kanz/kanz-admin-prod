import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import { TOrder, TOrderDetail } from '@/types/order.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  cancelOrder,
  completeOrder,
  deleteOrder,
  downloadListOrder,
  downloadPdfOrdder,
  getOrderById,
  getOrders,
} from './http/order.service';

/**
 * Get orders
 * @param opt
 * @returns
 */
export const useGetOrders = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TResponsePaginate<TOrder>>,
) => {
  return useQuery<TResponsePaginate<TOrder>, ApiServiceErr>(
    ['orders', params],
    () => getOrders(params),
    opt,
  );
};

/**
 * Get order by id
 * @param id
 * @param opt
 * @returns
 */
export const useGetOrderById = (
  id: number,
  opt?: QueryObserverOptions<TOrderDetail>,
) => {
  return useQuery<TOrderDetail, ApiServiceErr>(
    ['orders', { id }],
    () => getOrderById(id),
    opt,
  );
};

/**
 * Download list order
 * @param params
 * @param opt
 * @returns
 */
export const useDownloadListOrder = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TApiResponse<{ url: string }>>,
) => {
  return useQuery<TApiResponse<{ url: string }>, ApiServiceErr>(
    ['download-list-order', { params }],
    () => downloadListOrder(params),
    opt,
  );
};

/**
 * Download pdf
 * @param id
 * @param opt
 * @returns
 */
export const useDownloadPdf = (
  id: number,
  opt?: QueryObserverOptions<TApiResponse<{ url: string }>>,
) => {
  return useQuery<TApiResponse<{ url: string }>, ApiServiceErr>(
    ['download-pdf-order', { id }],
    () => downloadPdfOrdder(id),
    opt,
  );
};

/**
 * Delete order
 * @param opt
 * @returns
 */
export const useDeleteOrder = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<TOrderDetail>, ApiServiceErr, string>(
    async (id) => {
      const resp = await deleteOrder(id);
      return resp;
    },
    opt,
  );
};

/**
 * Cancel order
 * @param opt
 * @returns
 */
export const useCancelOrder = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<TOrderDetail>, ApiServiceErr, string>(
    async (id) => {
      const resp = await cancelOrder(id);
      return resp;
    },
    opt,
  );
};

/**
 * Complete order
 * @param opt
 * @returns
 */
export const useCompleteOrder = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<TOrderDetail>, ApiServiceErr, string>(
    async (id) => {
      const resp = await completeOrder(id);
      return resp;
    },
    opt,
  );
};
