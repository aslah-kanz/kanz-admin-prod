'use server';

import http from '@/lib/axios-instance';
import { TApiResponse } from '@/types/api.type';
import {
  TCategory,
  TCategoryDetail,
  TCategoryRequest,
  TCategoryParams,
} from '@/types/category.type';
import { TDefaultSearchParams } from '@/types/common.type';

/**
 * Get categories
 * @returns
 */
export const getCategories = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponse<Array<TCategory>>>(
    '/categories',
    { params },
  );

  return data.data;
};

/**
 * Add category
 * @param payload
 * @returns
 */
export const addCategory = async (payload: TCategoryRequest) => {
  const { data } = await http.post<TApiResponse<TCategoryDetail>>(
    '/categories',
    payload,
  );

  return data;
};

/**
 * Edit category
 * @param id
 * @param payload
 * @returns
 */
export const editCategory = async (id: number, payload: TCategoryRequest) => {
  const { data } = await http.put<TApiResponse<TCategoryDetail>>(
    `/categories/${id}`,
    payload,
  );

  return data;
};

/**
 * Delete category
 * @param id
 * @returns
 */
export const deleteCategory = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TCategoryDetail>>(
    `/categories/${id}`,
  );

  return data;
};

/**
 * Get category by id
 * @param id
 * @returns
 */
export const getCategoryById = async (id: number) => {
  const { data } = await http.get<TApiResponse<TCategoryDetail>>(
    `/categories/${id}`,
  );

  return data.data;
};

export const getCategoriesOptions = async (params?: TCategoryParams) => {
  const { data } = await http.get<TApiResponse<TCategory[]>>('/categories', {
    params,
  });

  return data.data;
};
