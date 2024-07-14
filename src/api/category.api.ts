import { ApiServiceErr, MutOpt, TApiResponse } from '@/types/api.type';
import {
  TCategory,
  TCategoryDetail,
  TCategoryRequest,
  TCategoryParams,
} from '@/types/category.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import { TDefaultSearchParams } from '@/types/common.type';
import {
  addCategory,
  deleteCategory,
  editCategory,
  getCategories,
  getCategoryById,
  getCategoriesOptions,
} from './http/category.service';

/**
 * Get categories
 * @param opt
 * @returns
 */
export const useGetCategories = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<Array<TCategory>>,
) => {
  return useQuery<Array<TCategory>, ApiServiceErr>(
    ['categories', params],
    () => getCategories(params),
    opt,
  );
};

export const useGetCategoryById = (
  id: number,
  opt?: QueryObserverOptions<TCategoryDetail>,
) => {
  return useQuery<TCategoryDetail, ApiServiceErr>(
    ['categories', { id }],
    () => getCategoryById(id),
    opt,
  );
};

/**
 * Add category
 * @param opt
 * @returns
 */
export const useAddCategory = (opt?: MutOpt<TApiResponse<TCategoryDetail>>) => {
  return useMutation<
    TApiResponse<TCategoryDetail>,
    ApiServiceErr,
    TCategoryRequest
  >(async (payload) => {
    const resp = await addCategory(payload);
    return resp;
  }, opt);
};

/**
 * Update category
 * @param opt
 * @returns
 */
export const useEditCategory = (opt?: MutOpt<TApiResponse<TCategory>>) => {
  return useMutation<
    TApiResponse<TCategory>,
    ApiServiceErr,
    { id: number; payload: TCategoryRequest }
  >(async ({ id, payload }) => {
    const resp = await editCategory(id, payload);
    return resp;
  }, opt);
};

/**
 * Delete category
 * @param opt
 * @returns
 */
export const useDeleteCategory = (opt?: MutOpt<TApiResponse<TCategory>>) => {
  return useMutation<TApiResponse<TCategory>, ApiServiceErr, number>(
    async (id) => {
      const resp = await deleteCategory(id);
      return resp;
    },
    opt,
  );
};

export const useCategories = (
  params?: TCategoryParams,
  opt?: QueryObserverOptions<TCategory[]>,
) => {
  return useQuery<TCategory[], ApiServiceErr>(
    ['getCategories', params],
    () => getCategoriesOptions(params),
    opt,
  );
};
