import { TPrincipal } from './principal.type';

export type TAuthRegisterLinkItem = {
  label: string;
  route: string;
  tooltipText: string;
};

export type TAuthLogin = {
  username: string;
  password: string;
  types: string[];
};

export type TAuthForgotPassword = {
  email: string;
};

export type TAuthResetPassword = {
  token: string;
  password: string;
  passwordConfirmation: string;
};

export type TAuthLoginToken = {
  token: string;
  expiredAt: string;
};

export type TAuthOtpLoginParams = {
  code: string;
};

export type TAuthRefreshToken = {
  accessToken: string;
  refreshToken: string;
};

export type TAuthLoginResponse = {
  accessToken: TAuthLoginToken;
  refreshToken: TAuthLoginToken;
  principal: TPrincipal;
};

export type TAuthStore = {
  credential: TAuthLoginResponse | null;
  setCredential: (cred: TAuthLoginResponse) => void;
  resetCredential: () => void;
  isLoggedIn: () => boolean;
};
