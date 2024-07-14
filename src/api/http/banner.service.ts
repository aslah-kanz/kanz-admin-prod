'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import { TBanner } from '@/types/banner.type';
import { TDefaultSearchParams } from '@/types/common.type';

/**
 * Get banner
 * @param params
 * @returns
 */
export const getBanner = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponsePaginate<TBanner>>(`/banners`, {
    params,
  });
  return data.data;
};

export const getBannerById = async (bannerId: number) => {
  const { data } = await http.get<TApiResponse<TBanner>>(
    `/banners/${bannerId}`,
  );

  return data.data;
};

export const addBanner = async (payload: FormData) => {
  const { data } = await http.post<TApiResponse<{}>>(`/banners`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateBanner = async (payload: FormData, id: number) => {
  const { data } = await http.put<TApiResponse<{}>>(`/banners/${id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteBanner = async (id: number) => {
  const { data } = await http.delete<TApiResponse<{}>>(`/banners/${id}`);
  return data;
};
