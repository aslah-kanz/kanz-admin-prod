import getSession from '@/utils/auth.util';

const useAuthServer = () => {
  let isLoggedIn: boolean;
  const session = getSession();
  if (!session) {
    isLoggedIn = false;
  } else {
    isLoggedIn = true;
  }

  return { isLoggedIn };
};

export default useAuthServer;
