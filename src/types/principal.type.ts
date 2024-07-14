import { TImage } from './common.type';
import { TCountry } from './country.type';
import { TRole } from './role.type';
import { TStore } from './store.type';

export type TPrincipalDetailItems = {
  description: string;
  value: string | boolean;
};

export type TPrincipalDetail = {
  city: string;
  country: Partial<TCountry>;
  companyNumber: string;
  companyNameEn: string;
  companyNameAr: string;
  items?: TPrincipalDetailItems[];
};

type TDepartment = {
  id: number;
  code: string;
  name: string;
};

export type TPrincipal = {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode?: string | number;
  phoneNumber: string;
  type: string | null;
  code?: string;
  roles?: Partial<TRole>[];
  details?: TPrincipalDetail;
  principalDetails?: TPrincipalDetail[];
  note?: string;
  bcId?: string;
  status?: string;
  dob?: string;
  birthDate?: string;
  gender?: string;
  profilePicture?: string;
  image?: TImage;
  file?: File;
  stores?: TStore[];
  departments?: TDepartment[];
};
