import { UseMutationOptions } from 'react-query';

export type TApiSearchParams = {
  size: number;
  page: number;
  sort: string;
  order: string;
  search: string;
  [key: string]: any;
};

export type TApiResponse<D> = {
  code: string;
  message: string | null;
  data: D;
  timestamp: string;
};

export type TResponsePaginate<D> = {
  [x: string]: any;
  page: number;
  size: number;
  count: number;
  totalCount: number;
  content: D[];
};

export type TApiResponsePaginate<D> = Omit<TApiResponse<D>, 'data'> & {
  data: TResponsePaginate<D>;
};

export type ApiServiceErr = any;

export type MutOpt<Response, TVariables = unknown> = UseMutationOptions<
  Response,
  ApiServiceErr,
  TVariables,
  unknown
>;
