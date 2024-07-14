import useAuthStore from '@/store/auth.store';
import { TPrincipal } from '@/types/principal.type';
import { useMemo } from 'react';

const useAuth = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  const credential = useAuthStore((state) => state.credential);

  const principal = useMemo<TPrincipal | undefined>(
    () => credential?.principal,
    [credential?.principal],
  );

  return {
    isLoggedIn,
    credential,
    principal,
  };
};

export default useAuth;
