'use server';

import http from '@/lib/axios-instance';
import { TShippingAddress } from '@/types/address.type';
import {
  TApiResponse,
  TApiResponsePaginate,
  TApiSearchParams,
} from '@/types/api.type';

export const getAddress = async (params?: TApiSearchParams) => {
  const { data } = await http.get<TApiResponsePaginate<TShippingAddress>>(
    `/principal-addresses`,
    { params },
  );
  return data;
};

export const addAddress = async (payload: TShippingAddress) => {
  const { data } = await http.post<TApiResponse<TShippingAddress>>(
    `/principal-addresses`,
    payload,
  );
  return data;
};

export const updateAddress = async (payload: TShippingAddress, id: number) => {
  const { data } = await http.put<TApiResponse<TShippingAddress>>(
    `/principal-addresses/${id}`,
    payload,
  );
  return data;
};

export const setAsMainAddress = async (id: number) => {
  const { data } = await http.post<TApiResponse<TShippingAddress>>(
    `/principal-addresses/${id}/default`,
  );
  return data;
};

export const deleteAddress = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TShippingAddress>>(
    `/principal-addresses/${id}`,
  );
  return data;
};
