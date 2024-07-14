'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import {
  TCertification,
  TCertificationDetail,
  TCertificationPayload,
  TCertificationParams,
} from '@/types/certification.type';

export const getCertifications = async (params?: TCertificationParams) => {
  const { data } = await http.get<TApiResponsePaginate<TCertification>>(
    '/certificates',
    {
      params,
    },
  );

  return data.data;
};

/**
 * Add category
 * @param payload
 * @returns
 */
export const addCertification = async (payload: TCertificationPayload) => {
  const { data } = await http.post<TApiResponse<TCertificationDetail>>(
    '/certificates',
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return data;
};

/**
 * Edit category
 * @param id
 * @param payload
 * @returns
 */
export const editCertification = async (
  id: number,
  payload: TCertificationPayload,
) => {
  const { data } = await http.put<TApiResponse<TCertificationDetail>>(
    `/certificates/${id}`,
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return data;
};

/**
 * Delete category
 * @param id
 * @returns
 */
export const deleteCertification = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TCertificationDetail>>(
    `/certificates/${id}`,
  );

  return data;
};

/**
 * Get category by id
 * @param id
 * @returns
 */
export const getCertificationById = async (id?: number) => {
  const { data } = await http.get<TApiResponse<TCertificationDetail>>(
    `/certificates/${id}`,
  );

  return data.data;
};
