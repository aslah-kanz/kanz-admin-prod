export type TBalance = {
  balance: number;
  currency: string;
};

export type TWalletHystory = {
  id: number;
  date: string;
  orderNumber: string;
  details: string;
  amount: number;
};
