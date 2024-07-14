import http from '@/lib/axios-instance';
import {
  TApiResponse,
  TApiResponsePaginate,
  TApiSearchParams,
} from '@/types/api.type';
import { TBalance, TWalletHystory } from '@/types/wallet.type';

export const getWalletBalance = async () => {
  const { data } = await http.get<TApiResponse<TBalance>>(
    '/vendor/wallet-summaries',
  );

  return data.data;
};

export const getWalletHistory = async (query: Partial<TApiSearchParams>) => {
  const { page = 1, search = '', size = 56 } = query;

  const queryString = new URLSearchParams({
    page: (page - 1).toString(),
    search,
    size: size.toString(),
  });

  const { data } = await http.get<TApiResponsePaginate<TWalletHystory>>(
    `/vendor/wallet-histories?${queryString}`,
  );

  return data.data;
};
