import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import {
  TBrand,
  TBrandDetail,
  TBrandRequest,
  TBrandParams,
} from '@/types/brand.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import { TDefaultSearchParams } from '@/types/common.type';
import {
  addBrand,
  deleteBrand,
  editBrand,
  getBrands,
  getBrandById,
} from './http/brand.service';

/**
 * Get brands
 * @param opt
 * @returns
 */
export const useGetBrands = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TResponsePaginate<TBrand>>,
) => {
  return useQuery<TResponsePaginate<TBrand>, ApiServiceErr>(
    ['brands', params],
    () => getBrands(params),
    opt,
  );
};

export const useGetBrandById = (
  id: number,
  opt?: QueryObserverOptions<TBrandDetail>,
) => {
  return useQuery<TBrandDetail, ApiServiceErr>(
    ['brands', { id }],
    () => getBrandById(id),
    opt,
  );
};

/**
 * Add brand
 * @param opt
 * @returns
 */
export const useAddBrand = (opt?: MutOpt<TApiResponse<TBrandDetail>>) => {
  return useMutation<TApiResponse<TBrandDetail>, ApiServiceErr, TBrandRequest>(
    async (payload) => {
      const resp = await addBrand(payload);
      return resp;
    },
    opt,
  );
};

/**
 * Update brand
 * @param opt
 * @returns
 */
export const useEditBrand = (opt?: MutOpt<TApiResponse<TBrand>>) => {
  return useMutation<
    TApiResponse<TBrand>,
    ApiServiceErr,
    { id: number; payload: TBrandRequest }
  >(async ({ id, payload }) => {
    const resp = await editBrand(id, payload);
    return resp;
  }, opt);
};

/**
 * Delete brand
 * @param opt
 * @returns
 */
export const useDeleteBrand = (opt?: MutOpt<TApiResponse<TBrand>>) => {
  return useMutation<TApiResponse<TBrand>, ApiServiceErr, number>(
    async (id) => {
      const resp = await deleteBrand(id);
      return resp;
    },
    opt,
  );
};

export const useBrands = (
  params?: TBrandParams,
  opt?: QueryObserverOptions<TResponsePaginate<TBrand>>,
) => {
  return useQuery<TResponsePaginate<TBrand>, ApiServiceErr>(
    ['getBrands', params],
    () => getBrands(params),
    opt,
  );
};
