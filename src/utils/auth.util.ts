import { TAuthLoginResponse } from '@/types/auth.type';
import { cookies } from 'next/headers';

/**
 * Get session
 * @returns
 */
export default function getSession() {
  const credFromCookie = cookies().get('kanzway-admin-cred')?.value as string;

  if (!credFromCookie) return null;

  const session = JSON.parse(
    decodeURIComponent(atob(credFromCookie)),
  ) as TAuthLoginResponse;

  return session;
}
