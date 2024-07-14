'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import {
  TCatalogue,
  TCatalogueDetail,
  TCataloguePayload,
  TCatalogueParams,
} from '@/types/catalogue.type';

export const getCatalogues = async (params?: TCatalogueParams) => {
  const { data } = await http.get<TApiResponsePaginate<TCatalogue>>(
    '/catalogues',
    {
      params,
    },
  );

  return data.data;
};

/**
 * Add category
 * @param payload
 * @returns
 */
export const addCatalogue = async (payload: TCataloguePayload) => {
  const { data } = await http.post<TApiResponse<TCatalogueDetail>>(
    '/catalogues',
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
export const editCatalogue = async (id: number, payload: TCataloguePayload) => {
  const { data } = await http.put<TApiResponse<TCatalogueDetail>>(
    `/catalogues/${id}`,
    payload,
  );

  return data;
};

/**
 * Delete category
 * @param id
 * @returns
 */
export const deleteCatalogue = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TCatalogueDetail>>(
    `/catalogues/${id}`,
  );

  return data;
};

/**
 * Get category by id
 * @param id
 * @returns
 */
export const getCatalogueById = async (id?: number) => {
  const { data } = await http.get<TApiResponse<TCatalogueDetail>>(
    `/catalogues/${id}`,
  );

  return data.data;
};
