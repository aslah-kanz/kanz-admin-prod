import { TShippingAddress } from './address.type';
import { TPrincipal } from './principal.type';
import { TOverviewProduct } from './product.type';
import { TStore } from './store.type';

export type TOrder = {
  id: string;
  code: string;
  invoiceNumber: string;
  createdAt: Date;
  updatedAt: Date;
  principal: TPrincipal;
  grandTotal: number;
  status: string;
  purchaseQuotes: TPurchaseQuote[];
};

export type TPurchaseQuote = {
  id: string;
  store: Omit<TStore, 'employees'>;
  status: string;
};

export type TOrderDetail = {
  id: string;
  code: string;
  invoiceNumber: string;
  createdAt: Date;
  updatedAt: Date;
  principal: TPrincipal;
  address: TShippingAddress;
  estimatedDeliveryDay: number;
  estimatedDeliveryCost: number;
  subTotal: number;
  promoCode: string;
  discountPrice: number;
  grandTotal: number;
  status: string;
  items: TOrderItem[];
};

export type TOrderItem = {
  id: string;
  product: TOverviewProduct;
  quantity: number;
  price: number;
  subTotal: number;
  comment: string;
};
