import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TApiSearchParams,
} from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import { TPrivilage, TRole, TRoleAdd, TRoleDetail } from '@/types/role.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  addRole,
  deleteRole,
  getAllRole,
  getPrivilage,
  getRoleById,
  updateRole,
} from './http/role.service';

export const useGetAllRole = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TApiResponse<TRole[]>>,
) => {
  return useQuery<TApiResponse<TRole[]>, ApiServiceErr>(
    ['getAllRole', params],
    () => getAllRole(params),
    opt,
  );
};

export const useGetPrivilage = (
  params?: TApiSearchParams,
  opt?: QueryObserverOptions<TPrivilage[]>,
) => {
  return useQuery<TPrivilage[], ApiServiceErr>(
    ['getPrivilage', params],
    () => getPrivilage(params),
    opt,
  );
};

export const useGetRoleById = (
  id: number,
  opt?: QueryObserverOptions<TRoleDetail>,
) => {
  return useQuery<TRoleDetail, ApiServiceErr>(
    ['getRoleById', id],
    () => getRoleById(id),
    opt,
  );
};

export const useAddRole = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, TRoleAdd>(
    async (payload) => {
      const resp = await addRole(payload);
      return resp;
    },
    opt,
  );
};

export const useUpdateRole = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<
    TApiResponse<{}>,
    ApiServiceErr,
    { id: number; payload: TRoleAdd }
  >(async ({ id, payload }) => {
    const resp = await updateRole(payload, id);
    return resp;
  }, opt);
};

export const useDeleteRole = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, number>(
    async (addressId) => {
      const resp = await deleteRole(addressId);
      return resp;
    },
    opt,
  );
};
