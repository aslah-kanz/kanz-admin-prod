'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import {
  TProduct,
  TProductDetail,
  TProductPayload,
} from '@/types/product.type';

/**
 * Get products
 * @param params
 * @returns
 */
export const getProducts = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponsePaginate<TProduct>>(`/products`, {
    params,
  });

  return data.data;
};

/**
 * Get Product by id
 * @param id
 * @returns
 */
export const getProductById = async (id: number) => {
  const { data } = await http.get<TApiResponse<TProductDetail>>(
    `/products/${id}`,
  );
  return data.data;
};

/**
 * Delete Product by id
 * @param id
 * @returns
 */
export const deleteProduct = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TProduct>>(`/products/${id}`);
  return data;
};

export const editProduct = async (payload: TProductPayload) => {
  const { data } = await http.put<TApiResponse<TProduct>>(
    `/products/${payload.id}`,
    { ...payload, id: undefined },
  );
  return data;
};

/**
 * Add Product by id
 * @param id
 * @returns
 */
export const addProduct = async (payload: TProductPayload) => {
  const { data } = await http.post<TApiResponse<TProduct>>(
    `/products`,
    payload,
  );
  return data;
};
