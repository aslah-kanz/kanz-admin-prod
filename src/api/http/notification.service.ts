'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import { TNotification } from '@/types/notification.type';

export const getNotification = async () => {
  const { data } =
    await http.get<TApiResponsePaginate<TNotification>>(`/notifications`);
  return data.data;
};

export const readNotification = async (id: number) => {
  const { data } = await http.put<TApiResponse<{}>>(
    `/notifications/${id}/read`,
  );
  return data;
};
