export type TCurrency = {
  code: string;
  description: string;
  symbol: string;
};

export type TDocument = {
  id: number;
  name: string;
  url: string;
  type: string;
};

export type TBankList = {
  id: number;
  paymentMode: string;
  name: string;
  beneficiaryName: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  currency: TCurrency;
  proofDocument: TDocument;
};

export type TBankAdd = {
  currencyId: number | string;
  documentId: number;
  paymentMode: string;
  name: string;
  beneficiaryName: string;
  city: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  file?: File;
};
