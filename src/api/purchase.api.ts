import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import { TPurchase, TPurchaseDetail } from '@/types/purchase.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  assignToVendor,
  cancelPurchase,
  completePurchase,
  deletePurchase,
  downloadListPurchase,
  downloadPdfPurchase,
  getPurchaseById,
  getPurchases,
} from './http/purchase.service';

/**
 * Get purchases
 * @param opt
 * @returns
 */
export const useGetPurchases = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TResponsePaginate<TPurchase>>,
) => {
  return useQuery<TResponsePaginate<TPurchase>, ApiServiceErr>(
    ['purchases', params],
    () => getPurchases(params),
    opt,
  );
};

/**
 * Get purchase by id
 * @param id
 * @param opt
 * @returns
 */
export const useGetPurchaseById = (
  id: number,
  opt?: QueryObserverOptions<TPurchaseDetail>,
) => {
  return useQuery<TPurchaseDetail, ApiServiceErr>(
    ['purchases', { id }],
    () => getPurchaseById(id),
    opt,
  );
};

/**
 * Download list purchase
 * @param params
 * @param opt
 * @returns
 */
export const useDownloadListPurchase = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TApiResponse<{ url: string }>>,
) => {
  return useQuery<TApiResponse<{ url: string }>, ApiServiceErr>(
    ['download-list-purchase', { params }],
    () => downloadListPurchase(params),
    opt,
  );
};

/**
 * Download pdf
 * @param id
 * @param opt
 * @returns
 */
export const useDownloadPdfPurchase = (
  id: number,
  opt?: QueryObserverOptions<TApiResponse<{ url: string }>>,
) => {
  return useQuery<TApiResponse<{ url: string }>, ApiServiceErr>(
    ['download-pdf-purchase', { id }],
    () => downloadPdfPurchase(id),
    opt,
  );
};

/**
 * Assign to vendor
 * @param opt
 * @returns
 */
export const useAssignToVendor = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, number>(async (id) => {
    const resp = await assignToVendor(id);
    return resp;
  }, opt);
};

/**
 * Delete purchase
 * @param opt
 * @returns
 */
export const useDeletePurchase = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, number>(async (id) => {
    const resp = await deletePurchase(id);
    return resp;
  }, opt);
};

/**
 * Cancel purchase
 * @param opt
 * @returns
 */
export const useCancelPurchase = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, number>(async (id) => {
    const resp = await cancelPurchase(id);
    return resp;
  }, opt);
};

/**
 * Complete purchase
 * @param opt
 * @returns
 */
export const useCompletePurchase = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, number>(async (id) => {
    const resp = await completePurchase(id);
    return resp;
  }, opt);
};
