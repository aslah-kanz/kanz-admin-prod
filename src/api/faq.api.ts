import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import {
  TFaq,
  TFaqDefail,
  TFaqGroup,
  TFaqGroupDetail,
  TFaqGroupRequest,
  TFaqRequest,
} from '@/types/faq.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  addFaq,
  addFaqGroup,
  deleteFaq,
  deleteFaqGroup,
  editFaq,
  editFaqGroup,
  getFaqById,
  getFaqGroupById,
  getFaqGroups,
  getFaqs,
} from './http/faq.service';

/**
 * Get faq groups
 * @param params
 * @param opt
 * @returns
 */
export const useGetFaqGroups = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TResponsePaginate<TFaqGroup>>,
) => {
  return useQuery<TResponsePaginate<TFaqGroup>, ApiServiceErr>(
    ['faq-groups', params],
    () => getFaqGroups(params),
    opt,
  );
};

/**
 * Add faq group
 * @param opt
 * @returns
 */
export const useAddFaqGroup = (opt?: MutOpt<TApiResponse<TFaqGroup>>) => {
  return useMutation<TApiResponse<TFaqGroup>, ApiServiceErr, TFaqGroupRequest>(
    async (payload) => {
      const resp = await addFaqGroup(payload);
      return resp;
    },
    opt,
  );
};

/**
 * Edit faq group
 * @param opt
 * @returns
 */
export const useEditFaqGroup = (opt?: MutOpt<TApiResponse<TFaqGroup>>) => {
  return useMutation<
    TApiResponse<TFaqGroup>,
    ApiServiceErr,
    { id: number; payload: TFaqGroupRequest }
  >(async ({ id, payload }) => {
    const resp = await editFaqGroup(id, payload);
    return resp;
  }, opt);
};

/**
 * Delete faq group
 * @param opt
 * @returns
 */
export const useDeleteFaqGroup = (opt?: MutOpt<TApiResponse<TFaqGroup>>) => {
  return useMutation<TApiResponse<TFaqGroup>, ApiServiceErr, number>(
    async (id) => {
      const resp = await deleteFaqGroup(id);
      return resp;
    },
    opt,
  );
};

export const useGetFaqGroupById = (
  id: number,
  opt?: QueryObserverOptions<TFaqGroupDetail>,
) => {
  return useQuery<TFaqGroupDetail, ApiServiceErr>(
    ['faq-groups', { id }],
    () => getFaqGroupById(id),
    opt,
  );
};

/**
 * Get faqs
 * @param params
 * @param opt
 * @returns
 */
export const useGetFaqs = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TResponsePaginate<TFaq>>,
) => {
  return useQuery<TResponsePaginate<TFaq>, ApiServiceErr>(
    ['faqs', params],
    () => getFaqs(params),
    opt,
  );
};

/**
 * Add faq
 * @param opt
 * @returns
 */
export const useAddFaq = (opt?: MutOpt<TApiResponse<TFaq>>) => {
  return useMutation<TApiResponse<TFaq>, ApiServiceErr, TFaqRequest>(
    async (payload) => {
      const resp = await addFaq(payload);
      return resp;
    },
    opt,
  );
};

/**
 * Edit faq
 * @param opt
 * @returns
 */
export const useEditFaq = (opt?: MutOpt<TApiResponse<TFaq>>) => {
  return useMutation<
    TApiResponse<TFaq>,
    ApiServiceErr,
    { id: number; payload: TFaqRequest }
  >(async ({ id, payload }) => {
    const resp = await editFaq(id, payload);
    return resp;
  }, opt);
};

/**
 * Delete faq
 * @param opt
 * @returns
 */
export const useDeleteFaq = (opt?: MutOpt<TApiResponse<TFaq>>) => {
  return useMutation<TApiResponse<TFaq>, ApiServiceErr, number>(async (id) => {
    const resp = await deleteFaq(id);
    return resp;
  }, opt);
};

export const useGetFaqById = (
  id: number,
  opt?: QueryObserverOptions<TFaqDefail>,
) => {
  return useQuery<TFaqDefail, ApiServiceErr>(
    ['faqs', { id }],
    () => getFaqById(id),
    opt,
  );
};
