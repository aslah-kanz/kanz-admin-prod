'use server';

import http from '@/lib/axios-instance';
import { TApiResponse } from '@/types/api.type';
import { TSettingWebsite } from '@/types/setting-website.type';

/**
 * Get setting website
 * @returns
 */
export const getSettingWebsite = async () => {
  const { data } = await http.get<TApiResponse<TSettingWebsite>>(
    'https://private-baae6c-zulfianfachrureza.apiary-mock.com/setting-website',
  );

  return data.data;
};
