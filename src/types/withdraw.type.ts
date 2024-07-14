import { TPrincipal } from './principal.type';

export type TWithdraw = {
  id: number;
  principal: TPrincipal;
  date: Date;
  amount: number;
  status: string;
  rejectReason: string;
};

export type TWithdrawDetail = TWithdraw;

export type TUpdateStatusWithdraw = {};
