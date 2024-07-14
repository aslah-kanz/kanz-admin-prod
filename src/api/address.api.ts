import { TShippingAddress } from '@/types/address.type';
import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TApiResponsePaginate,
  TApiSearchParams,
} from '@/types/api.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import { generateInitResponsePaginate } from '@/utils/api.util';
import {
  addAddress,
  deleteAddress,
  getAddress,
  setAsMainAddress,
  updateAddress,
} from './http/address.service';

export const useGetAddresses = (
  params?: TApiSearchParams,
  opt?: QueryObserverOptions<TApiResponsePaginate<TShippingAddress>>,
) => {
  return useQuery<TApiResponsePaginate<TShippingAddress>, ApiServiceErr>(
    ['getShippingAddresses', params],
    () => getAddress(params),
    {
      placeholderData: generateInitResponsePaginate<TShippingAddress>(),
      ...opt,
    },
  );
};

export const useAddAddress = (opt?: MutOpt<TApiResponse<TShippingAddress>>) => {
  return useMutation<
    TApiResponse<TShippingAddress>,
    ApiServiceErr,
    TShippingAddress
  >(async (payload) => {
    const resp = await addAddress(payload);
    return resp;
  }, opt);
};

export const useUpdateAddress = (
  opt?: MutOpt<TApiResponse<TShippingAddress>>,
) => {
  return useMutation<
    TApiResponse<TShippingAddress>,
    ApiServiceErr,
    { id: number; payload: TShippingAddress }
  >(async ({ id, payload }) => {
    const resp = await updateAddress(payload, id);
    return resp;
  }, opt);
};

export const useSetAsMainAddress = (
  opt?: MutOpt<TApiResponse<TShippingAddress>>,
) => {
  return useMutation<TApiResponse<TShippingAddress>, ApiServiceErr, number>(
    async (id) => {
      const resp = await setAsMainAddress(id);
      return resp;
    },
    opt,
  );
};

export const useDeleteAddress = (
  opt?: MutOpt<TApiResponse<TShippingAddress>>,
) => {
  return useMutation<TApiResponse<TShippingAddress>, ApiServiceErr, number>(
    async (addressId) => {
      const resp = await deleteAddress(addressId);
      return resp;
    },
    opt,
  );
};
