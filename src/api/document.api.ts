import { ApiServiceErr, MutOpt, TApiResponse } from '@/types/api.type';
import { TDocument } from '@/types/document.type';
import { useMutation } from 'react-query';
import { deleteDocument, uploadDocument } from './http/document.service';

/**
 * Upload image
 * @param opt
 * @returns
 */
export const useUploadDocument = (opt?: MutOpt<TApiResponse<TDocument>>) => {
  return useMutation<TApiResponse<TDocument>, ApiServiceErr, FormData>(
    async (payload) => {
      const resp = await uploadDocument(payload);
      return resp;
    },
    opt,
  );
};

/**
 * Delete image
 * @param opt
 * @returns
 */
export const useDeleteDocument = (opt?: MutOpt<TApiResponse<TDocument>>) => {
  return useMutation<TApiResponse<TDocument>, ApiServiceErr, number>(
    async (id) => {
      const resp = await deleteDocument(id);
      return resp;
    },
    opt,
  );
};
