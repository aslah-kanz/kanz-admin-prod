'use server';

import http from '@/lib/axios-instance';
import { TApiResponse } from '@/types/api.type';
import {
  TAuthForgotPassword,
  TAuthLogin,
  TAuthLoginResponse,
  TAuthLoginToken,
  TAuthOtpLoginParams,
  TAuthResetPassword,
} from '@/types/auth.type';
import { cookies } from 'next/headers';

export const authLogin = async (payload: TAuthLogin) => {
  const { data } = await http.post<TApiResponse<TAuthLoginResponse>>(
    '/auth/login',
    payload,
  );
  return data;
};

export const authLogout = async () => {
  const { data } = await http.post<TApiResponse<{}>>('/auth/logout');
  cookies().delete('kanzway-admin-cred');
  cookies().delete('kanzway-admin-profile');
  return data;
};

export const authForgotPassword = async (payload: TAuthForgotPassword) => {
  const { data } = await http.post<TApiResponse<{}>>(
    '/auth/forgot-password',
    payload,
  );
  return data;
};

export const authResetPassword = async (payload: TAuthResetPassword) => {
  const { data } = await http.post<TApiResponse<{}>>(
    '/auth/reset-password',
    payload,
  );
  return data;
};

export const authOtpLogin = async (
  payload: TAuthOtpLoginParams,
  token: string,
) => {
  const { data } = await http.post<TApiResponse<TAuthLoginToken>>(
    '/auth/otp/validate',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};
