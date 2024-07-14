import { ApiServiceErr } from '@/types/api.type';
import {
  TDashboardChart,
  TDashboardSummary,
  TDashboardVendor,
} from '@/types/dashboard.type';
import { QueryObserverOptions, useQuery } from 'react-query';
import {
  getDashboardChart,
  getDashboardSummary,
  getDashboardVendor,
} from './http/dashboard.service';

export const useDashboardSummary = (
  opt?: QueryObserverOptions<TDashboardSummary>,
) => {
  return useQuery<TDashboardSummary, ApiServiceErr>(
    ['getDashboardSummary'],
    () => getDashboardSummary(),
    opt,
  );
};

export const useDashboardChart = (
  opt?: QueryObserverOptions<TDashboardChart>,
) => {
  return useQuery<TDashboardChart, ApiServiceErr>(
    ['getDashboardChart'],
    () => getDashboardChart(),
    opt,
  );
};

export const useDashboardVendor = (
  opt?: QueryObserverOptions<TDashboardVendor[]>,
) => {
  return useQuery<TDashboardVendor[], ApiServiceErr>(
    ['getDashboardVendor'],
    () => getDashboardVendor(),
    opt,
  );
};
