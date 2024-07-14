'use server';

import http from '@/lib/axios-instance';
import { TApiResponse } from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import { TCountry, TCountryRequest } from '@/types/country.type';

/**
 * Get countries
 * @returns
 */
export const getCountries = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponse<TCountry[]>>('/countries', {
    params,
  });

  return data.data;
};

/**
 * Add country
 * @param payload
 * @returns
 */
export const addCountry = async (payload: TCountryRequest) => {
  const { data } = await http.post<TApiResponse<TCountry>>(
    '/countries',
    payload,
  );

  return data;
};

/**
 * Edit country
 * @param id
 * @param payload
 * @returns
 */
export const editCountry = async (id: number, payload: TCountryRequest) => {
  const { data } = await http.put<TApiResponse<TCountry>>(
    `/countries/${id}`,
    payload,
  );

  return data;
};

/**
 * Delete country
 * @param id
 * @returns
 */
export const deleteCountry = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TCountry>>(
    `/countries/${id}`,
  );

  return data;
};
