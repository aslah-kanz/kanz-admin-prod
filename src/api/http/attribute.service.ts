'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import {
  TAttribute,
  TAttributeRequest,
  TAttributeParams,
} from '@/types/attribute.type';

/**
 * Get attributes
 * @returns
 */
export const getAttributes = async () => {
  const { data } = await http.get<TApiResponsePaginate<TAttribute>>(
    'https://private-baae6c-zulfianfachrureza.apiary-mock.com/attributes',
  );

  return data.data;
};

/**
 * Delete attribute
 * @param id
 * @returns
 */
export const deleteAttribute = async (id: number) => {
  const { data } = await http.delete<TApiResponse<{}>>(
    `https://private-baae6c-zulfianfachrureza.apiary-mock.com/attributes/${id}`,
  );

  return data;
};

/**
 * Add attribute
 * @param payload
 * @returns
 */
export const addAttribute = async (payload: TAttributeRequest) => {
  const { data } = await http.post<TApiResponse<TAttribute>>(
    'https://private-baae6c-zulfianfachrureza.apiary-mock.com/attributes-post',
    payload,
  );

  return data;
};

/**
 * Edit attribute
 * @param id
 * @param payload
 * @returns
 */
export const editAttribute = async (id: number, payload: TAttributeRequest) => {
  const { data } = await http.put<TApiResponse<TAttribute>>(
    `https://private-baae6c-zulfianfachrureza.apiary-mock.com/attributes/${id}`,
    payload,
  );

  return data;
};

/**
 * Get attribute by id
 * @param id
 * @param payload
 * @returns
 */
export const getAttributeById = async (id: number) => {
  const { data } = await http.get<TApiResponse<TAttribute>>(
    `https://private-baae6c-zulfianfachrureza.apiary-mock.com/attributes/${id}`,
  );

  return data.data;
};

export const getAttributesOptions = async (params?: TAttributeParams) => {
  const { data } = await http.get<TApiResponsePaginate<TAttribute>>(
    'https://private-f762d7-kanzway2.apiary-mock.com/v1/admin/attributes',
    { params },
  );

  return data.data;
};
