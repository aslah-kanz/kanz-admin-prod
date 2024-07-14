import { ApiServiceErr } from '@/types/api.type';
import { TSettingWebsite } from '@/types/setting-website.type';
import { QueryObserverOptions, useQuery } from 'react-query';
import { getSettingWebsite } from './http/setting-website.service';

/**
 * Get setting website
 * @param opt
 * @returns
 */
export const useGetSettingWebsite = (
  opt?: QueryObserverOptions<TSettingWebsite>,
) => {
  return useQuery<TSettingWebsite, ApiServiceErr>(
    ['setting-website'],
    () => getSettingWebsite(),
    opt,
  );
};
