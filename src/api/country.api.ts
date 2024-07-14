import { ApiServiceErr, MutOpt, TApiResponse } from '@/types/api.type';
import { TCountry, TCountryRequest } from '@/types/country.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import { TDefaultSearchParams } from '@/types/common.type';
import {
  addCountry,
  deleteCountry,
  editCountry,
  getCountries,
} from './http/country.service';

/**
 * Get countries
 * @param opt
 * @returns
 */
export const useGetCountries = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TCountry[]>,
) => {
  return useQuery<TCountry[], ApiServiceErr>(
    ['countries', params],
    () => getCountries(params),
    opt,
  );
};

/**
 * Add country
 * @param opt
 * @returns
 */
export const useAddCountry = (opt?: MutOpt<TApiResponse<TCountry>>) => {
  return useMutation<TApiResponse<TCountry>, ApiServiceErr, TCountryRequest>(
    async (payload) => {
      const resp = await addCountry(payload);
      return resp;
    },
    opt,
  );
};

/**
 * Update country
 * @param opt
 * @returns
 */
export const useEditCountry = (opt?: MutOpt<TApiResponse<TCountry>>) => {
  return useMutation<
    TApiResponse<TCountry>,
    ApiServiceErr,
    { id: number; payload: TCountryRequest }
  >(async ({ id, payload }) => {
    const resp = await editCountry(id, payload);
    return resp;
  }, opt);
};

/**
 * Delete country
 * @param opt
 * @returns
 */
export const useDeleteCountry = (opt?: MutOpt<TApiResponse<TCountry>>) => {
  return useMutation<TApiResponse<TCountry>, ApiServiceErr, number>(
    async (id) => {
      const resp = await deleteCountry(id);
      return resp;
    },
    opt,
  );
};
