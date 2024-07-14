import { ApiServiceErr, MutOpt, TApiResponse } from '@/types/api.type';
import { TDocument } from '@/types/bank.type';
import { useMutation } from 'react-query';
import { uploadDocument } from './http/documents.service';

export const useUploadDocument = (opt?: MutOpt<TApiResponse<TDocument>>) => {
  return useMutation<TApiResponse<TDocument>, ApiServiceErr, FormData>(
    async (payload) => {
      const resp = await uploadDocument(payload);
      return resp;
    },
    opt,
  );
};
