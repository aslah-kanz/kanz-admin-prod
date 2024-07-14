import { TCountry } from './country.type';

export type TBaseCountryCodeInputProps = {
  value: number;
  onChange: (value: number, country: TCountry) => void;
  children: React.ReactNode;
};
