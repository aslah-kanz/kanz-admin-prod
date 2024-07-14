import { TDefaultSearchParams, TLocale } from '@/types/common.type';
import { TImage } from './image.type';
import { TOverviewProduct } from './product.type';

// TODO: refactor when actual api is ready

export type TRejectExchangePayload = {
  comment: string;
};

export type TExchangeItem = {
  id: string;
  purchaseQuote: {
    id: string;
    invoiceNumber: string;
    customerOrderInvoiceNumber: string;
    vendorSku: string;
    store: {
      id: number;
      name: string;
      address: string;
      city: string;
      country: string;
      latitude: number;
      longitude: number;
      saleItemCount: number;
      status: string;
      employees: [
        {
          firstName: string;
          lastName: string;
          email: string;
          countryCode: string;
          phoneNumber: string;
        },
      ];
    };
  };
  principal: TPrincipal;
  number: string;
  createdAt: Date;
  updatedAt: Date;
  images: TImage[];
  product: TOverviewProduct;
  quantity: number;
  price: number;
  subTotal: number;
  reason: string;
  adminComment: string;
  vendorComment: string;
  status: string;
};

export type TExchange = {
  id: number;
  exchangeNumber: string;
  order: TOrder;
  date: Date;
  principal: TPrincipal;
  subTotal: number;
  store: TStore[];
  status: string;
};

export type TPrincipal = {
  id: number;
  code: string;
  type: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type TStore = {
  id: number;
  name: string;
  principal: TStorePrincipal;
};

export type TStorePrincipal = {
  id: number;
  firstName: string;
  lastName: string;
};

export type TExchangeDetail = {
  id: number;
  exchangeNumber: string;
  date: string;
  order: TOrder;
  principal: TPrincipal;
  items: TItem[];
  reason: string;
  images: string[];
  status: string;
};

export type TItem = {
  id: number;
  orderItemId: number;
  product: TProduct;
  price: number;
  qty: number;
  subtotal: number;
  store: TStore;
  note: string;
  rejectReason: string;
  status: string;
};

export type TProduct = {
  title: TLocale;
  slug: string;
  code: string;
  mpn: string;
  gtin: TGtin;
  familyCode: string;
  image: TImage;
};

export type TGtin = {
  ean: string;
  upc: string;
};

export type TOrder = {
  id: number;
  code: string;
};

export type TExchangeActionPayload = {
  adminComment: string;
};

export type TExchangeParams = TDefaultSearchParams & {
  startCreatedAt?: string;
  endCreatedAt?: string;
  status?: string;
};
