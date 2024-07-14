import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import {
  TCatalogue,
  TCatalogueDetail,
  TCataloguePayload,
  TCatalogueParams,
} from '@/types/catalogue.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  addCatalogue,
  deleteCatalogue,
  editCatalogue,
  getCatalogues,
  getCatalogueById,
} from './http/catalogue.service';

export const useCatalogues = (
  params?: TCatalogueParams,
  opt?: QueryObserverOptions<TResponsePaginate<TCatalogue>>,
) => {
  return useQuery<TResponsePaginate<TCatalogue>, ApiServiceErr>(
    ['getCatalogues', params],
    () => getCatalogues(params),
    opt,
  );
};

export const useGetCatalogueById = (
  id?: number,
  opt?: QueryObserverOptions<TCatalogueDetail>,
) => {
  return useQuery<TCatalogueDetail, ApiServiceErr>(
    ['getCatalogueById', { id }],
    () => getCatalogueById(id),
    opt,
  );
};

/**
 * Add category
 * @param opt
 * @returns
 */
export const useAddCatalogue = (
  opt?: MutOpt<TApiResponse<TCatalogueDetail>>,
) => {
  return useMutation<
    TApiResponse<TCatalogueDetail>,
    ApiServiceErr,
    TCataloguePayload
  >(async (payload) => {
    const resp = await addCatalogue(payload);
    return resp;
  }, opt);
};

/**
 * Update category
 * @param opt
 * @returns
 */
export const useEditCatalogue = (opt?: MutOpt<TApiResponse<TCatalogue>>) => {
  return useMutation<
    TApiResponse<TCatalogue>,
    ApiServiceErr,
    { id: number; payload: TCataloguePayload }
  >(async ({ id, payload }) => {
    const resp = await editCatalogue(id, payload);
    return resp;
  }, opt);
};

/**
 * Delete category
 * @param opt
 * @returns
 */
export const useDeleteCatalogue = (opt?: MutOpt<TApiResponse<TCatalogue>>) => {
  return useMutation<TApiResponse<TCatalogue>, ApiServiceErr, number>(
    async (id) => {
      const resp = await deleteCatalogue(id);
      return resp;
    },
    opt,
  );
};
