'use server';

import http from '@/lib/axios-instance';
import { TApiResponse } from '@/types/api.type';
import {
  TDashboardChart,
  TDashboardSummary,
  TDashboardVendor,
} from '@/types/dashboard.type';

export const getDashboardSummary = async () => {
  const { data } = await http.get<TApiResponse<TDashboardSummary>>(
    `https://private-f762d7-kanzway2.apiary-mock.com/v1/admin/dashboard/sumary`,
  );

  return data.data;
};

export const getDashboardChart = async () => {
  const { data } = await http.get<TApiResponse<TDashboardChart>>(
    `https://private-f762d7-kanzway2.apiary-mock.com/v1/admin/dashboard/chart`,
  );

  return data.data;
};

export const getDashboardVendor = async () => {
  const { data } = await http.get<TApiResponse<TDashboardVendor[]>>(
    `https://private-f762d7-kanzway2.apiary-mock.com/v1/admin/dashboard/vendor`,
  );

  return data.data;
};
