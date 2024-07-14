import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import {
  TCertification,
  TCertificationDetail,
  TCertificationPayload,
  TCertificationParams,
} from '@/types/certification.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  addCertification,
  deleteCertification,
  editCertification,
  getCertifications,
  getCertificationById,
} from './http/certification.service';

export const useCertifications = (
  params?: TCertificationParams,
  opt?: QueryObserverOptions<TResponsePaginate<TCertification>>,
) => {
  return useQuery<TResponsePaginate<TCertification>, ApiServiceErr>(
    ['getCertifications', params],
    () => getCertifications(params),
    opt,
  );
};

export const useGetCertificationById = (
  id?: number,
  opt?: QueryObserverOptions<TCertificationDetail>,
) => {
  return useQuery<TCertificationDetail, ApiServiceErr>(
    ['getCertificationById', { id }],
    () => getCertificationById(id),
    opt,
  );
};

/**
 * Add category
 * @param opt
 * @returns
 */
export const useAddCertification = (
  opt?: MutOpt<TApiResponse<TCertificationDetail>>,
) => {
  return useMutation<
    TApiResponse<TCertificationDetail>,
    ApiServiceErr,
    TCertificationPayload
  >(async (payload) => {
    const resp = await addCertification(payload);
    return resp;
  }, opt);
};

/**
 * Update category
 * @param opt
 * @returns
 */
export const useEditCertification = (
  opt?: MutOpt<TApiResponse<TCertification>>,
) => {
  return useMutation<
    TApiResponse<TCertification>,
    ApiServiceErr,
    { id: number; payload: TCertificationPayload }
  >(async ({ id, payload }) => {
    const resp = await editCertification(id, payload);
    return resp;
  }, opt);
};

/**
 * Delete category
 * @param opt
 * @returns
 */
export const useDeleteCertification = (
  opt?: MutOpt<TApiResponse<TCertification>>,
) => {
  return useMutation<TApiResponse<TCertification>, ApiServiceErr, number>(
    async (id) => {
      const resp = await deleteCertification(id);
      return resp;
    },
    opt,
  );
};
