// import { TBrand } from './brand.type';
import { TLocale } from './common.type';
import { TImage } from './image.type';

type TProductGtin = {
  upc: string;
  ean: string;
};

export type TProduct = {
  id: 0;
  code: string;
  mpn: string;
  gtin: TProductGtin;
  name: TLocale;
  slug: string;
  familyCode: string;
  icon: TImage;
  image: TImage;
  description: TLocale;
  brand: TBrand;
  length: number;
  width: number;
  height: number;
  weight: number;
  metaKeyword: string;
  metaDescription: string;
  price: number;
  originalPrice: number;
  maxPrice: number;
  sellable: true;
  status: string;
  comment: string;
  categoryIds: Array<number>;
};

export type THighlightProduct = Pick<TProduct, 'id' | 'name' | 'image'>;

export type TOverviewProduct = Pick<
  TProduct,
  | 'id'
  | 'code'
  | 'mpn'
  | 'gtin'
  | 'name'
  | 'slug'
  | 'familyCode'
  | 'icon'
  | 'image'
  | 'brand'
  | 'price'
  | 'originalPrice'
  | 'maxPrice'
  | 'comment'
>;

type TBrand = {
  id: number;
  name: TLocale;
  image: TImage;
};

export type TGtin = {
  ean: string;
  upc: string;
};

// export type TProduct = {
//   id: number;
//   title: TLocale;
//   slug: string;
//   code: string;
//   mpn: string;
//   gtin: TGtin;
//   familyCode: string;
//   image: TImage;
//   categories: TLocale;
//   brand: TBrand;
//   status: string;
//   description: TLocale;
// };

export type TProductParams = {
  size?: string | undefined;
  page?: string | undefined;
  order?: string | undefined;
  sort?: string | undefined;
  storeId?: string | undefined;
  search?: string | undefined;
  categoryId?: string | undefined;
  brandId?: string | undefined;
  status?: string[];
};

type TGaleries = {
  id?: number;
  image: TImage;
};

type TStore = {
  id: number;
  name: string;
};

type TItems = {
  description: TLocale;
  value1: TLocale | null;
  valueUnit1: TLocale | null;
  value2: TLocale | null;
  value3: TLocale | null;
  valueUnit2: TLocale | null;
  valueUnit3: TLocale | null;
  icon: string;
};

type TProperties = {
  name: TLocale;
  type: string;
  fields: TLocale[];
  sequence: number;
  items: TItems[];
};

export type TProductDetail = TProduct & {
  store: TStore;
  minPrice: number;
  maxPrice: number;
  discount: number;
  stock: number;
  description: TLocale;
  metaKeyword: string;
  metaDescription: string;
  galleries: TGaleries[];
  properties: TProperties[];
  isActive: boolean;
};

type TDocument = {
  name: TLocale;
  file: string;
};

export type TProductPayload = {
  id?: number;
  name: TLocale;
  brandId: number;
  code: string;
  mpn: string;
  gtin?: {
    ean: string;
    upc: string;
  };
  familyCode: string;
  categoryIds: number[];
  description: TLocale;
  weight: number;
  height: number;
  width: number;
  length: number;
  metaKeyword: string;
  metaDescription: string;
  sellable: boolean;
  status: string;
  comment?: string | null;
  galleries?: {
    image: TImage;
    order: number;
  }[];
  documents?: TDocument[];
  imageIds?: number[];
  documentIds?: number[];
  // properties: {
  //   name: TLocale;
  //   type: string;
  //   fields: TLocale[];
  //   sequence: number;
  //   items: {
  //     attributeId: number;
  //     value1: TLocale;
  //     value2: TLocale;
  //     value3: TLocale;
  //     icon: string;
  //   }[];
  // }[];
};
