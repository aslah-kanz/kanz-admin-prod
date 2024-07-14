export type TShippingAddress = {
  id?: number;
  recipientName: string;
  phoneNumber: string;
  countryCode: string | number;
  name: string;
  address: string;
  country: string;
  city: string;
  latitude: string;
  longitude: string;
  defaultAddress?: boolean;
};
