export type TPurchase = {
  id: number;
  grandTotal: number;
  invoice: string;
  orderDate: Date;
  status: string;
  vendor: string;
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

export type TPurchaseDetail = {
  address: string;
  customerName: string;
  productList: TProduct[];
  id: string;
  invoice: string;
  orderDate: string;
  grandTotal: number;
  vendor: string;
  status: string;
  timestamp: string;
};

export type TProduct = {
  id: string;
  productName: string;
  brand: string;
  qty: number;
  price: number;
};

export type TGtin = {
  ean: string;
  upc: string;
};

export type Title = {
  en: string;
  ar: string;
};

export type TPrincipal = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
};

export type TPrincipalAddress = {
  id: number;
  address_name: string;
  address: string;
  city: string;
  country: string;
  lat: string;
  long: string;
  postcode: string;
};
