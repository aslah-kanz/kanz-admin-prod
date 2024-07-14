import { TTimestamp } from './common.type';

export type TShippingMethod = TTimestamp & {
  id: number;
  code: string;
  providerName: string;
  deliveryCompanyName: string;
  deliveryEstimateTime: string;
  detail: TShippingMethodDetail;
};

type TShippingMethodDetail = {
  success: boolean;
  errorCode: number;
  errorMsg: string;
  traceId: string;
  deliveryCompany: TDeliveryCompany[];
};

type TDeliveryCompany = {
  serviceType: string;
  avgDeliveryTime: string;
  deliveryOptionId: number;
  deliveryCompanyName: string;
  deliveryOptionName: string;
  price: number;
};

export type TShippingMethodRequest = {
  providerName: string;
  deliveryCompanyName: string;
  deliveryEstimateTime: string;
};
