import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';

export function generateInitResponse<D>(): TApiResponse<D> {
  return {
    code: '-1',
    message: null,
    data: [] as D,
    timestamp: '',
  };
}

export function generateInitResponsePaginate<D>(): TApiResponsePaginate<D> {
  return {
    code: '-1',
    message: null,
    data: {
      content: [],
      page: 0,
      size: 0,
      count: 0,
      totalCount: 0,
    },
    timestamp: '',
  };
}
