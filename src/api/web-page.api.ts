import { ApiServiceErr, MutOpt, TApiResponse } from '@/types/api.type';
import { TWebPage, TWebPageRequest } from '@/types/web-page.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  addWebPage,
  editWebPage,
  getWebPageBySlug,
} from './http/web-page.service';

/**
 * Add web page
 * @param opt
 * @returns
 */
export const useAddWebPage = (opt?: MutOpt<TApiResponse<TWebPage>>) => {
  return useMutation<TApiResponse<TWebPage>, ApiServiceErr, TWebPageRequest>(
    async (payload) => {
      const resp = await addWebPage(payload);
      return resp;
    },
    opt,
  );
};

/**
 * Get web page by slug
 * @param slug
 * @param opt
 * @returns
 */
export const useGetWebPageBySlug = (
  slug: string,
  opt?: QueryObserverOptions<TApiResponse<TWebPage>>,
) => {
  return useQuery<TApiResponse<TWebPage>, ApiServiceErr>(
    ['web-pages', { slug }],
    () => getWebPageBySlug(slug),
    opt,
  );
};

/**
 * Edit web page
 * @param opt
 * @returns
 */
export const useEditWebPage = (opt?: MutOpt<TApiResponse<TWebPage>>) => {
  return useMutation<
    TApiResponse<TWebPage>,
    ApiServiceErr,
    { id: number; payload: TWebPageRequest }
  >(async ({ id, payload }) => {
    const resp = await editWebPage(id, payload);
    return resp;
  }, opt);
};
