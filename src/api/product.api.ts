import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import {
  TProduct,
  TProductDetail,
  TProductPayload,
} from '@/types/product.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProductById,
  getProducts,
} from './http/product.service';

export const useGetProducts = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TResponsePaginate<TProduct>>,
) => {
  return useQuery<TResponsePaginate<TProduct>, ApiServiceErr>(
    ['products', params],
    () => getProducts(params),
    opt,
  );
};

export const useProductById = (
  id: number | undefined | null,
  opt?: QueryObserverOptions<TProductDetail>,
) => {
  return useQuery<TProductDetail, ApiServiceErr>(
    ['getProductById', id],
    () => getProductById(Number(id)),
    opt,
  );
};

export const useDeleteProduct = (opt?: MutOpt<TApiResponse<TProduct>>) => {
  return useMutation<TApiResponse<TProduct>, ApiServiceErr, number>(
    async (id) => {
      const resp = await deleteProduct(id);
      return resp;
    },
    opt,
  );
};

export const useAddProduct = (opt?: MutOpt<TApiResponse<TProduct>>) => {
  return useMutation<TApiResponse<TProduct>, ApiServiceErr, TProductPayload>(
    async (formValue) => {
      const resp = await addProduct(formValue);
      return resp;
    },
    opt,
  );
};

export const useEditroduct = (opt?: MutOpt<TApiResponse<TProduct>>) => {
  return useMutation<TApiResponse<TProduct>, ApiServiceErr, TProductPayload>(
    async (formValue) => {
      const resp = await editProduct(formValue);
      return resp;
    },
    opt,
  );
};
