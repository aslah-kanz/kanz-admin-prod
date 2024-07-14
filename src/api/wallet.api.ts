import { TBalance, TWalletHystory } from '@/types/wallet.type';
import { QueryObserverOptions, useQuery } from 'react-query';
import {
  ApiServiceErr,
  TApiSearchParams,
  TResponsePaginate,
} from '@/types/api.type';
import { getWalletBalance, getWalletHistory } from './http/wallet.service';

export const useGetWalletBallance = (opt?: QueryObserverOptions<TBalance>) => {
  return useQuery<TBalance, ApiServiceErr>(
    ['getWalletBallance'],
    () => getWalletBalance(),
    {
      ...opt,
    },
  );
};

export const useGetWalletHistory = (
  params: Partial<TApiSearchParams>,
  opt?: QueryObserverOptions<TResponsePaginate<TWalletHystory>>,
) => {
  return useQuery<TResponsePaginate<TWalletHystory>, ApiServiceErr>(
    ['getWalletHistory', params],
    () => getWalletHistory(params),
    opt,
  );
};
