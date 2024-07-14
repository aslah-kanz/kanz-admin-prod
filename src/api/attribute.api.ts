import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import {
  TAttribute,
  TAttributeRequest,
  TAttributeParams,
} from '@/types/attribute.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  addAttribute,
  deleteAttribute,
  editAttribute,
  getAttributeById,
  getAttributes,
  getAttributesOptions,
} from './http/attribute.service';

/**
 * Get attributes
 * @param opt
 * @returns
 */
export const useGetAttributes = (
  opt?: QueryObserverOptions<TResponsePaginate<TAttribute>>,
) => {
  return useQuery<TResponsePaginate<TAttribute>, ApiServiceErr>(
    ['attributes'],
    () => getAttributes(),
    opt,
  );
};

/**
 * Delete attribute
 * @param opt
 * @returns
 */
export const useDeleteAttribute = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, number>(async (id) => {
    const resp = await deleteAttribute(id);
    return resp;
  }, opt);
};

/**
 * Get attributes by id
 * @param id
 * @param opt
 * @returns
 */
export const useGetAttributeById = (
  id: number,
  opt?: QueryObserverOptions<TAttribute>,
) => {
  return useQuery<TAttribute, ApiServiceErr>(
    ['shipping-methods', { id }],
    () => getAttributeById(id),
    opt,
  );
};

/**
 * Add attributes
 * @param opt
 * @returns
 */
export const useAddAttribute = (opt?: MutOpt<TApiResponse<TAttribute>>) => {
  return useMutation<
    TApiResponse<TAttribute>,
    ApiServiceErr,
    TAttributeRequest
  >(async (payload) => {
    const resp = await addAttribute(payload);
    return resp;
  }, opt);
};

/**
 * Edit attributes
 * @param opt
 * @returns
 */
export const useEditAttribute = (opt?: MutOpt<TApiResponse<TAttribute>>) => {
  return useMutation<
    TApiResponse<TAttribute>,
    ApiServiceErr,
    { id: number; payload: TAttributeRequest }
  >(async ({ id, payload }) => {
    const resp = await editAttribute(id, payload);
    return resp;
  }, opt);
};

export const useAttributes = (
  params?: TAttributeParams,
  opt?: QueryObserverOptions<TResponsePaginate<TAttribute>>,
) => {
  return useQuery<TResponsePaginate<TAttribute>, ApiServiceErr>(
    ['getAttributes', params],
    () => getAttributesOptions(params),
    opt,
  );
};
