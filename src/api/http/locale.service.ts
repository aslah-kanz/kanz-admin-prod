'use server';

import http from '@/lib/axios-instance';
import { TApiResponse } from '@/types/api.type';
import { TCountry } from '@/types/country.type';
import { TLanguage } from '@/types/language.type';

/**
 * Get countries
 * @returns
 */
export const getCountries = async () => {
  const { data } = await http.get<TApiResponse<TCountry[]>>('/countries');

  return data.data;
};

/**
 * Get languages
 * @returns
 */
export const getLanguages = async () => {
  const { data } = await http.get<TApiResponse<TLanguage[]>>('/languages');

  return data.data;
};
