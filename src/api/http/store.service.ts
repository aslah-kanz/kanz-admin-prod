'use server';

import http from '@/lib/axios-instance';
import { TApiResponsePaginate } from '@/types/api.type';
import { TStore, TStoreParams } from '@/types/store.type';

export const getStoresOptions = async (params?: TStoreParams) => {
  const { data } = await http.get<TApiResponsePaginate<TStore>>(
    'https://private-f762d7-kanzway2.apiary-mock.com/v1/vendor/stores',
    {
      params,
    },
  );
  return data.data;
};
