'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import {
  TFaq,
  TFaqDefail,
  TFaqGroup,
  TFaqGroupDetail,
  TFaqGroupRequest,
  TFaqRequest,
} from '@/types/faq.type';

/**
 * Get faq groups
 * @param params
 * @returns
 */
export const getFaqGroups = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponsePaginate<TFaqGroup>>(
    `/faq-groups`,
    {
      params,
    },
  );

  return data.data;
};

/**
 * Add faq group
 * @param payload
 * @returns
 */
export const addFaqGroup = async (payload: TFaqGroupRequest) => {
  const { data } = await http.post<TApiResponse<TFaqGroup>>(
    '/faq-groups',
    payload,
  );

  return data;
};

/**
 * Edit faq group
 * @param id
 * @param payload
 * @returns
 */
export const editFaqGroup = async (id: number, payload: TFaqGroupRequest) => {
  const { data } = await http.put<TApiResponse<TFaqGroup>>(
    `/faq-groups/${id}`,
    payload,
  );

  return data;
};

/**
 * Delete faq group
 * @param id
 * @returns
 */
export const deleteFaqGroup = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TFaqGroup>>(
    `/faq-groups/${id}`,
  );

  return data;
};

/**
 * Get faq group by id
 * @param id
 * @returns
 */
export const getFaqGroupById = async (id: number) => {
  const { data } = await http.get<TApiResponse<TFaqGroupDetail>>(
    `/faq-groups/${id}`,
  );

  return data.data;
};

/**
 * Get faqs
 * @returns
 */
export const getFaqs = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponsePaginate<TFaq>>(`/faqs`, {
    params,
  });

  return data.data;
};

/**
 * Add faq
 * @param payload
 * @returns
 */
export const addFaq = async (payload: TFaqRequest) => {
  const { data } = await http.post<TApiResponse<TFaq>>('/faqs', payload);

  return data;
};

/**
 * Edit faq
 * @param id
 * @param payload
 * @returns
 */
export const editFaq = async (id: number, payload: TFaqRequest) => {
  const { data } = await http.put<TApiResponse<TFaq>>(`/faqs/${id}`, payload);

  return data;
};

/**
 * Delete faq
 * @param id
 * @returns
 */
export const deleteFaq = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TFaq>>(`/faqs/${id}`);

  return data;
};

/**
 * Get faq by id
 * @param id
 * @returns
 */
export const getFaqById = async (id: number) => {
  const { data } = await http.get<TApiResponse<TFaqDefail>>(`/faqs/${id}`);

  return data.data;
};
