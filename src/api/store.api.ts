import { ApiServiceErr, TResponsePaginate } from '@/types/api.type';
import { TStore, TStoreParams } from '@/types/store.type';
import { QueryObserverOptions, useQuery } from 'react-query';
import { getStoresOptions } from './http/store.service';

export const useGetStoresOptions = (
  params?: TStoreParams,
  opt?: QueryObserverOptions<TResponsePaginate<TStore>>,
) => {
  return useQuery<TResponsePaginate<TStore>, ApiServiceErr>(
    ['stores', params],
    () => getStoresOptions(params),
    opt,
  );
};
