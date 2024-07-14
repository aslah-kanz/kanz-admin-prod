import { TLocale, TLocaleRequest, TTimestamp } from './common.type';

export type TPaymentMethod = TTimestamp & {
  id: 0;
  code: string;
  name: TLocale;
  instruction: TLocale;
};

export type TPaymentMethodRequest = {
  name: TLocaleRequest;
  instruction: TLocaleRequest;
};
