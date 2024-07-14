import { ApiServiceErr, MutOpt, TApiResponse } from '@/types/api.type';
import {
  TAuthForgotPassword,
  TAuthLogin,
  TAuthLoginResponse,
  TAuthLoginToken,
  TAuthOtpLoginParams,
  TAuthResetPassword,
} from '@/types/auth.type';
import { useMutation } from 'react-query';
import {
  authForgotPassword,
  authLogin,
  authLogout,
  authOtpLogin,
  authResetPassword,
} from './http/auth.service';

export const useAuthLogin = (
  opt?: MutOpt<TApiResponse<TAuthLoginResponse>>,
) => {
  return useMutation<
    TApiResponse<TAuthLoginResponse>,
    ApiServiceErr,
    TAuthLogin
  >(async (payload) => {
    const resp = await authLogin(payload);
    return resp;
  }, opt);
};

export const useAuthLogout = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, any>(async () => {
    const resp = await authLogout();
    return resp;
  }, opt);
};

export const useAuthForgotPassword = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, TAuthForgotPassword>(
    async (payload) => {
      const resp = await authForgotPassword(payload);
      return resp;
    },
    opt,
  );
};

export const useAuthResetPassword = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, TAuthResetPassword>(
    async (payload) => {
      const resp = await authResetPassword(payload);
      return resp;
    },
    opt,
  );
};

export const useAuthOTPLogin = (
  opt?: MutOpt<TApiResponse<TAuthLoginToken>>,
) => {
  return useMutation<
    TApiResponse<TAuthLoginToken>,
    ApiServiceErr,
    { payload: TAuthOtpLoginParams; token: string }
  >(async ({ payload, token }) => {
    const resp = await authOtpLogin(payload, token);
    return resp;
  }, opt);
};
