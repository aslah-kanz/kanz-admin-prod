'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import {
  TRefundItem,
  TRefundActionPayload,
  TRefundParams,
} from '@/types/refund.type';

/**
 * Get refunds
 * @returns
 */
export const getRefunds = async (params?: TRefundParams) => {
  const { data } = await http.get<TApiResponsePaginate<TRefundItem>>(
    '/admin/refunds',
    {
      params,
    },
  );

  return data.data;
};

/**
 * Get refund by id
 * @param id
 * @returns
 */
export const getRefundById = async (id: string) => {
  const { data } = await http.get<TApiResponse<TRefundItem>>(
    `/admin/refunds/${id}`,
  );

  return data.data;
};
// /**
//  * Get refunds
//  * @returns
//  */
// export const getRefunds = async () => {
//   const { data } = await http.get<TApiResponsePaginate<TRefund>>('/refunds');

//   return data.data;
// };

// /**
//  * Get refund by id
//  * @param id
//  * @returns
//  */
// export const getRefundById = async (id: string) => {
//   const { data } = await http.get<TApiResponse<TRefund>>(`/refunds/${id}`);

//   return data.data;
// };

/**
 * Confirm refund
 * @returns
 */
export const approveRefund = async (
  id: string,
  payload: TRefundActionPayload,
) => {
  const { data } = await http.post<TApiResponse<{}>>(
    `/admin/refunds/${id}/approve`,
    payload,
  );

  return data;
};

/**
 * Reject refund
 * @returns
 */
export const rejectRefund = async (
  id: string,
  payload: TRefundActionPayload,
) => {
  const { data } = await http.post<TApiResponse<{}>>(
    `/admin/refunds/${id}/reject`,
    payload,
  );

  return data;
};

/**
 * Get refunds mock
 * @returns
 */
// export const getRefundsMock = async () => {
//   const { data } = await http.get<TApiResponsePaginate<TRefundMock>>(
//     'https://private-baae6c-zulfianfachrureza.apiary-mock.com/refunds',
//   );

//   return data.data;
// };

/**
 * Get refund by id mock
 * @param id
 * @returns
 */
// export const getRefundByIdMock = async (id: number) => {
//   const { data } = await http.get<TApiResponse<TRefundDetailMock>>(
//     `https://private-baae6c-zulfianfachrureza.apiary-mock.com/refunds/${id}`,
//   );

//   return data.data;
// };
