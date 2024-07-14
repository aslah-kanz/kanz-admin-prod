import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import { TNotification } from '@/types/notification.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import { getNotification, readNotification } from './http/notification.service';

export const useGetNotification = (
  opt?: QueryObserverOptions<TResponsePaginate<TNotification>>,
) => {
  return useQuery<TResponsePaginate<TNotification>, ApiServiceErr>(
    ['getNotification'],
    () => getNotification(),
    opt,
  );
};

export const useReadNotification = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, number>(
    async (notifId) => {
      const resp = await readNotification(notifId);
      return resp;
    },
    opt,
  );
};
