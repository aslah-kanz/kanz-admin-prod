export type TDashboardSummary = {
  total_transaction: number;
  total_vendor: number;
  total_order: number;
  on_progress_order: number;
};

export type TDashboardChart = {
  total_transaction: number;
  charts: {
    [x: string]: number;
  };
};

export type TDashboardVendor = {
  id: number;
  code: string;
  type: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
};

export type TDashboardChartParams = {
  month: string;
  year: string;
};
