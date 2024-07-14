export type TStore = {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  employees: Array<TEmployee>;
};

export type TEmployee = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
};

export type TStoreParams = {
  size?: string | undefined;
  page?: string | undefined;
  order?: string | undefined;
  sort?: string | undefined;
  search?: string | undefined;
};

export type TStoreRequest = Omit<TStore, 'id'>;
