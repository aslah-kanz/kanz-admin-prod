'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import {
  TContactUs,
  TContactUsPayload,
  TContactUsParams,
} from '@/types/contact-us.type';

export const getContactUs = async (params?: TContactUsParams) => {
  const { data } = await http.get<TApiResponsePaginate<TContactUs>>(
    'https://private-f762d7-kanzway2.apiary-mock.com/v1/admin/contact-us',
    {
      params,
    },
  );

  return data.data;
};

export const editContactUs = async (id: number, payload: TContactUsPayload) => {
  const { data } = await http.put<TApiResponse<TContactUs>>(
    `https://private-f762d7-kanzway2.apiary-mock.com/v1/admin/contact-us/${id}`,
    payload,
  );

  return data;
};
