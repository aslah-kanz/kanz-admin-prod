import { TDefaultParams, TLocale } from '@/types/common.type';

/**
 * get current lang
 */
export const getLang = (params: TDefaultParams | any, text: TLocale) => {
  return text[params.locale as keyof TLocale]
    ? text[params.locale as keyof TLocale]
    : text.en;
};
