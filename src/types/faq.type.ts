import { STATUS, TLocale, TLocaleRequest } from './common.type';

export type TFaq = {
  id: number;
  code: string | null;
  question: TLocale;
  answer: TLocale;
  faqGroupId: number;
};

export type TFaqGroup = {
  id: number;
  code: string | null;
  title: TLocale;
  description: TLocale;
  showAtHomePage: boolean;
  faqs: Array<TFaq>;
  status: string;
};

export type TFaqGroupDetail = TFaqGroup & {
  status: STATUS;
};

export type TFaqDefail = TFaq & {
  status: STATUS;
};

export type TFaqGroupRequest = {
  title: TLocaleRequest;
  description?: TLocaleRequest;
  showAtHomePage: boolean;
  status: string;
};

export type TFaqRequest = {
  faqGroupId: number;
  question: TLocaleRequest;
  answer: TLocaleRequest;
  status: string;
};
