import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import { TBanner } from '@/types/banner.type';
import { TDefaultSearchParams } from '@/types/common.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  addBanner,
  deleteBanner,
  getBanner,
  getBannerById,
  updateBanner,
} from './http/banner.service';

export const useGetBanner = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TResponsePaginate<TBanner>>,
) => {
  return useQuery<TResponsePaginate<TBanner>, ApiServiceErr>(
    ['getBanner', params],
    () => getBanner(params),
    opt,
  );
};

export const useGetBannerById = (
  id: number,
  opt?: QueryObserverOptions<TBanner>,
) => {
  return useQuery<TBanner, ApiServiceErr>(
    ['getBannerById', id],
    () => getBannerById(id),
    opt,
  );
};

export const useAddBanner = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, FormData>(
    async (payload) => {
      const resp = await addBanner(payload);
      return resp;
    },
    opt,
  );
};

export const useUpdateBanner = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<
    TApiResponse<{}>,
    ApiServiceErr,
    { id: number; payload: FormData }
  >(async ({ id, payload }) => {
    const resp = await updateBanner(payload, id);
    return resp;
  }, opt);
};

export const useDeleteBanner = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, number>(
    async (bannerId) => {
      const resp = await deleteBanner(bannerId);
      return resp;
    },
    opt,
  );
};
