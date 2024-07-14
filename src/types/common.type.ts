import { Icon } from 'iconsax-react';

export type TSidebarMenu = {
  title: TLocale;
  href: string;
  icon: Icon;
};

export type TLocale = {
  en: string;
  ar: string;
};

export type TLocaleRequest = Partial<TLocale>;

export type TDefaultParams = {
  locale: string;
};

export type TDefaultSearchParams = {
  search?: string | undefined;
  page?: string | undefined;
  size?: string | undefined;
  order?: string | undefined;
  sort?: string | undefined;
  type?: string | undefined;
};

export type TDefaultPageParams = {
  params: TDefaultParams;
  searchParams: TDefaultSearchParams;
};

export type TShowStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export type TMeta = {
  metaKeyword: string;
  metaDescription: string;
};

export type TTimestamp = {
  createdAt: Date;
  updatedAt: Date;
};

export type TMetaRequest = {
  metaKeyword?: string;
  metaDescription?: string;
};

export type TProductPropertyTypeValue = 'image' | 'table';

export type TProductPropertyType = {
  label: string;
  value: TProductPropertyTypeValue;
};

export enum STATUS {
  draft = 'draft',
  ignored = 'ignored',
  published = 'published',
}

export type TImage = {
  id: string | number;
  name: string;
  url: string;
  width: number;
  height: number;
  type: 'image';
};

export type TListColumnOptions = {
  id: number;
  slug: string;
  label: string;
};
