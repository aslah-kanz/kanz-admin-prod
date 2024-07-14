'use server';

import http from '@/lib/axios-instance';
import { TApiResponse } from '@/types/api.type';
import { TWebPage, TWebPageRequest } from '@/types/web-page.type';

/**
 * Add web page
 * @param payload
 * @returns
 */
export const addWebPage = async (payload: TWebPageRequest) => {
  const { data } = await http.post<TApiResponse<TWebPage>>(
    '/web-pages',
    payload,
  );

  return data;
};

/**
 * Get web page by slug
 * @param slug
 * @returns
 */
export const getWebPageBySlug = async (slug: string) => {
  const { data } = await http.get<TApiResponse<TWebPage>>(
    `/web-pages/slug/${slug}`,
  );

  return data;
};

export const editWebPage = async (id: number, payload: TWebPageRequest) => {
  const { data } = await http.put<TApiResponse<TWebPage>>(
    `/web-pages/${id}`,
    payload,
  );

  return data;
};
