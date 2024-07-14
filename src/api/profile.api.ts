import { ApiServiceErr, MutOpt, TApiResponse } from '@/types/api.type';
import { TCustomerProfile, TEditPassword } from '@/types/profile.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  getProfile,
  updatePassword,
  updateProfile,
} from './http/profile.service';

export const useGetProfile = (opt?: QueryObserverOptions<TCustomerProfile>) => {
  return useQuery<TCustomerProfile, ApiServiceErr>(
    ['getDetailProfile'],
    () => getProfile(),
    {
      ...opt,
    },
  );
};

export const useUpdateProfile = (
  opt?: MutOpt<TApiResponse<TCustomerProfile>>,
) => {
  return useMutation<TApiResponse<TCustomerProfile>, ApiServiceErr, FormData>(
    async (payload) => {
      const resp = await updateProfile(payload);
      return resp;
    },
    opt,
  );
};

export const useUpdatePassword = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, TEditPassword>(
    async (payload) => {
      const resp = await updatePassword(payload);
      return resp;
    },
    opt,
  );
};
