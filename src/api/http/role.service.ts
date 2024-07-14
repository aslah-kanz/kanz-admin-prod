'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiSearchParams } from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import { TPrivilage, TRole, TRoleAdd, TRoleDetail } from '@/types/role.type';

export const getAllRole = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponse<TRole[]>>(`/roles`, {
    params,
  });
  return data;
};

export const getPrivilage = async (params?: TApiSearchParams) => {
  const { data } = await http.get<TApiResponse<TPrivilage[]>>(`/privileges`, {
    params,
  });

  return data.data;
};

export const getRoleById = async (roleId: number) => {
  const { data } = await http.get<TApiResponse<TRoleDetail>>(
    `/roles/${roleId}`,
  );

  return data.data;
};

export const addRole = async (payload: TRoleAdd) => {
  const { data } = await http.post<TApiResponse<{}>>(`/roles`, payload);
  return data;
};

export const updateRole = async (payload: TRoleAdd, id: number) => {
  const { data } = await http.put<TApiResponse<{}>>(`/roles/${id}`, payload);
  return data;
};

export const deleteRole = async (id: number) => {
  const { data } = await http.delete<TApiResponse<{}>>(`/roles/${id}`);
  return data;
};
