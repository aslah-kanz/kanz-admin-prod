'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import { TBrand, TBrandDetail, TBrandRequest } from '@/types/brand.type';
import { TDefaultSearchParams } from '@/types/common.type';

/**
 * Get brands
 * @returns
 */
export const getBrands = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponsePaginate<TBrand>>('/brands', {
    params,
  });

  return data.data;
};

/**
 * Add brand
 * @param payload
 * @returns
 */
export const addBrand = async (payload: TBrandRequest) => {
  const { data } = await http.post<TApiResponse<TBrandDetail>>(
    '/brands',
    payload,
  );

  return data;
};

/**
 * Edit brand
 * @param id
 * @param payload
 * @returns
 */
export const editBrand = async (id: number, payload: TBrandRequest) => {
  const { data } = await http.put<TApiResponse<TBrandDetail>>(
    `/brands/${id}`,
    payload,
  );

  return data;
};

/**
 * Delete brand
 * @param id
 * @returns
 */
export const deleteBrand = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TBrandDetail>>(
    `/brands/${id}`,
  );

  return data;
};

/**
 * Get brand by id
 * @param id
 * @returns
 */
export const getBrandById = async (id: number) => {
  const { data } = await http.get<TApiResponse<TBrandDetail>>(`/brands/${id}`);

  return data.data;
};
