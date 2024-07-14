import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import { TPrincipal } from '@/types/principal.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  addPrincipal,
  approvePrincipal,
  deletePrincipal,
  getPrincipalById,
  getPrincipalList,
  rejectPrincipal,
  updatePrincipal,
} from './http/principals.service';

export const useGetPrincipals = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TResponsePaginate<TPrincipal>>,
) => {
  return useQuery<TResponsePaginate<TPrincipal>, ApiServiceErr>(
    ['getPrincipalList', params],
    () => getPrincipalList(params),
    opt,
  );
};

export const useGetPrincipalsById = (
  id: string,
  opt?: QueryObserverOptions<TPrincipal>,
) => {
  return useQuery<TPrincipal, ApiServiceErr>(
    ['getPrincipalById', id],
    () => getPrincipalById(id),
    opt,
  );
};

export const useDeletePrincipals = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, number>(
    async (principlalId) => {
      const resp = await deletePrincipal(principlalId);
      return resp;
    },
    opt,
  );
};

export const useAddPrincipals = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, TPrincipal>(
    async (payload) => {
      const resp = await addPrincipal(payload);
      return resp;
    },
    opt,
  );
};

export const useUpdatePrincipals = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<
    TApiResponse<{}>,
    ApiServiceErr,
    { id: number; payload: TPrincipal }
  >(async ({ id, payload }) => {
    const resp = await updatePrincipal(payload, id);
    return resp;
  }, opt);
};

export const useApprovePrincipals = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, { id: number }>(
    async ({ id }) => {
      const resp = await approvePrincipal(id);
      return resp;
    },
    opt,
  );
};

export const useRejectPrincipals = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, { id: number }>(
    async ({ id }) => {
      const resp = await rejectPrincipal(id);
      return resp;
    },
    opt,
  );
};
