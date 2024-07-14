import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TApiSearchParams,
  TResponsePaginate,
} from '@/types/api.type';
import { TBankAdd, TBankList } from '@/types/bank.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import { addBank, deleteBank, editBank, getAllBank } from './http/bank.service';

export const useGetAllBank = (
  params: Partial<TApiSearchParams>,
  opt?: QueryObserverOptions<TResponsePaginate<TBankList>>,
) => {
  return useQuery<TResponsePaginate<TBankList>, ApiServiceErr>(
    ['getAllBank', params],
    () => getAllBank(params),
    opt,
  );
};

export const useAddBank = (opt?: MutOpt<TApiResponse<TBankList>>) => {
  return useMutation<TApiResponse<TBankList>, ApiServiceErr, TBankAdd>(
    async (payload) => {
      const resp = await addBank(payload);
      return resp;
    },
    opt,
  );
};

export const useEditBank = (opt?: MutOpt<TApiResponse<TBankList>>) => {
  return useMutation<
    TApiResponse<TBankList>,
    ApiServiceErr,
    { id: number; payload: TBankAdd }
  >(async ({ id, payload }) => {
    const resp = await editBank(payload, id);
    return resp;
  }, opt);
};

export const useDeleteBank = (opt?: MutOpt<TApiResponse<TBankList>>) => {
  return useMutation<TApiResponse<TBankList>, ApiServiceErr, number>(
    async (id) => {
      const resp = await deleteBank(id);
      return resp;
    },
    opt,
  );
};
