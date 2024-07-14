import { TLocale, TLocaleRequest } from './common.type';

export type TAttribute = {
  id: number;
  code: string;
  group: TLocale;
  name: TLocale;
  unit1: TLocale;
  unit2: TLocale;
  unit3: TLocale;
};

export type TAttributeDetail = TAttribute;

export type TAttributeRequest = {
  group: TLocaleRequest;
  name: TLocaleRequest;
  unit1: TLocaleRequest;
  unit2: TLocaleRequest;
  unit3: TLocaleRequest;
};

export type TAttributeParams = {
  size?: string | undefined;
  page?: string | undefined;
  order?: string | undefined;
  sort?: string | undefined;
  search?: string | undefined;
  categories?: number[];
  brands?: number[];
};

export type TAttributeOptions = {
  id: number;
  name: TLocale;
  categoryId: number;
  brandId: number;
  options: {
    value: string;
    unit: TLocale;
  }[];
};
