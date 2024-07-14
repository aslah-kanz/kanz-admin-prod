import { TDefaultSearchParams } from '@/types/common.type';
import { TImage } from './image.type';
import { TPrincipal } from './principal.type';
import { TOverviewProduct } from './product.type';
// import { TOverviewProduct } from './product.type';

export type TRefundItem = {
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

export type TRefund = {
  id: string;
  number: string;
  createdAt: Date;
  updatedAt: Date;
  total: Number;
  images: Array<TImage>;
  customerComment: string;
  status: string;
  comment?: string;
  items: Array<TRefundItem>;
};

export type TRefundMock = {
  id: number;
  refundNumber: string;
  order: Order;
  principal: Principal;
  items: Item[];
  store: Store[];
  date: string;
  subtotal: number;
  status: string;
};

export type Item = {
  id: number;
  product: Product;
};

export type Product = {
  id: number;
  title: Title;
  image: Image;
};

export type Image = {
  id: number;
  name: string;
  url: string;
  width: number;
  height: number;
  type: string;
};

export type Title = {
  en: string;
  ar: string;
};

export type Order = {
  id: number;
  code: string;
};

export type Principal = {
  id: number;
  code?: string;
  firstName: string;
  lastName: string;
};

export type Store = {
  id: number;
  name: string;
  principal: Principal;
};

export type TRefundDetailMock = {
  id: number;
  refundNumber: string;
  date: string;
  order: Order;
  principal: Principal;
  items: ItemDetail[];
  reason: string;
  images: string[];
  status: string;
};

export type ItemDetail = {
  id: number;
  orderItemId: number;
  product: ProductDetail;
  price: number;
  qty: number;
  subtotal: number;
  store: Store;
  note: string;
  rejectReason: string;
  status: string;
};

export type ProductDetail = {
  id: number;
  title: Title;
  slug: string;
  code: string;
  mpn: string;
  gtin: Gtin;
  familyCode: string;
  image: Image;
};

export type Gtin = {
  ean: string;
  upc: string;
};

export type TRefundActionPayload = {
  adminComment: string;
};

export type TRefundParams = TDefaultSearchParams & {
  startCreatedAt?: string;
  endCreatedAt?: string;
  status?: string;
};
