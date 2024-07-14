'use server';

import http from '@/lib/axios-instance';
import { TApiResponse } from '@/types/api.type';
import { TEditPassword, TCustomerProfile } from '@/types/profile.type';

export const getProfile = async () => {
  const { data } =
    await http.get<TApiResponse<TCustomerProfile>>('/customer-profiles');
  return data.data;
};

export const updateProfile = async (payload: FormData) => {
  const { data } = await http.putForm<TApiResponse<TCustomerProfile>>(
    `/customer-profiles`,
    payload,
  );
  return data;
};

export const updatePassword = async (payload: TEditPassword) => {
  const { data } = await http.post<TApiResponse<{}>>(
    `/auth/change-password`,
    payload,
  );
  return data;
};
