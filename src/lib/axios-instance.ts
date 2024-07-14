/* eslint-disable eqeqeq */
import { HTTP_STATUS } from '@/constants/common.constant';
import { TApiResponse } from '@/types/api.type';
import { TAuthLoginToken } from '@/types/auth.type';
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';
import { compareAsc } from 'date-fns';
import Cookies from 'js-cookie';
import { cookies } from 'next/headers';
import * as https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const defaultConfig: CreateAxiosDefaults = {
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  headers: {
    // 'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  maxContentLength: 10000000,
  maxBodyLength: 10000000,
  httpsAgent: agent,
};

const http = axios.create(defaultConfig);

http.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    config.headers = config.headers ?? {};
    if (cookies().has('kanzway-admin-cred')) {
      const cookieValue = cookies().get('kanzway-admin-cred')?.value as string;
      if (cookieValue) {
        const newCookieValue = JSON.parse(
          decodeURIComponent(atob(cookieValue)),
        );
        const token = newCookieValue?.accessToken?.token ?? '';
        const expDates = newCookieValue?.accessToken?.expiredAt ?? '';
        const result = compareAsc(new Date(expDates), new Date());
        if (result === 1) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => error,
);

async function refetchRequest(originalRequestConfig: AxiosRequestConfig) {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await http.request(originalRequestConfig);
    return response;
  } catch (error) {
    // Handle refetching errors here (optional)
    throw error;
  }
}

http.interceptors.response.use(
  async (response: AxiosResponse) => {
    const resp = response.data as TApiResponse<{}>;
    if (resp.code === HTTP_STATUS.TOKEN_EXPIRED) {
      const cookieValue = cookies().get('kanzway-admin-cred')?.value as string;
      const jsonCookieValue = cookieValue
        ? JSON.parse(decodeURIComponent(atob(cookieValue)))
        : null;

      if (jsonCookieValue) {
        const accessToken = jsonCookieValue?.accessToken?.token ?? '';
        const refreshToken = jsonCookieValue?.refreshToken?.token ?? '';

        // eslint-disable-next-line no-useless-catch
        try {
          const payload = {
            accessToken,
            refreshToken,
          };
          const { data } = await http.post<TApiResponse<TAuthLoginToken>>(
            '/auth/refresh-token',
            payload,
          );

          if (data.code === HTTP_STATUS.SUCCESS) {
            const newCreds = {
              principal: jsonCookieValue.principal,
              accessToken: data.data,
              refreshToken: jsonCookieValue.refreshToken,
            };
            Cookies.set(
              'kanzway-admin-cred',
              btoa(encodeURIComponent(JSON.stringify(newCreds))),
            );
            cookies().set(
              'kanzway-admin-cred',
              btoa(encodeURIComponent(JSON.stringify(newCreds))),
            );

            // Update original request config with new access token
            const originalRequestConfig = response.config; // Get original config
            originalRequestConfig.headers.Authorization = `Bearer ${data.data.token}`; // Update authorization header

            // Refetch the original request (optional dedicated function)
            const refetchedResponse = await refetchRequest(
              originalRequestConfig,
            );

            // Handle the refetched response (return or use in component)
            return refetchedResponse;
            // eslint-disable-next-line no-else-return
          } else {
            // Handle refresh token failure here (e.g., logout, error message)
            Cookies.remove('kanzway-admin-cred');
            Cookies.remove('kanzway-admin-profile');
            cookies().delete('kanzway-admin-cred');
            cookies().delete('kanzway-admin-profile');
            // Optionally throw an error to signal failure to the calling component
            throw new Error('Refresh token failed');
          }
        } catch (error) {
          // Handle general errors during refresh token flow
          throw error;
        }
      }
    } else if (
      resp.code === HTTP_STATUS.UNAUTHORIZED ||
      resp.code === HTTP_STATUS.TOKEN_INVALID
    ) {
      Cookies.remove('kanzway-admin-cred');
      Cookies.remove('kanzway-admin-profile');
      cookies().delete('kanzway-admin-cred');
      cookies().delete('kanzway-admin-profile');
    }

    // Return the original response if no refresh was needed
    return response;
  },
  (error) => {
    // Handle other errors in the request pipeline
    return Promise.reject(error);
  },
);

export default http;
