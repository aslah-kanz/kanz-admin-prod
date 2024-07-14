import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import {
  TContactUs,
  TContactUsPayload,
  TContactUsParams,
} from '@/types/contact-us.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import { editContactUs, getContactUs } from './http/contact-us.service';

export const useContactUs = (
  params?: TContactUsParams,
  opt?: QueryObserverOptions<TResponsePaginate<TContactUs>>,
) => {
  return useQuery<TResponsePaginate<TContactUs>, ApiServiceErr>(
    ['getContactUs', params],
    () => getContactUs(params),
    opt,
  );
};
export const useEditContactUs = (opt?: MutOpt<TApiResponse<TContactUs>>) => {
  return useMutation<
    TApiResponse<TContactUs>,
    ApiServiceErr,
    { id: number; payload: TContactUsPayload }
  >(async ({ id, payload }) => {
    const resp = await editContactUs(id, payload);
    return resp;
  }, opt);
};
