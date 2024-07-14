'use client';

// import { useAuthLogout } from '@/api/auth.api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SIDEBAR_MENU } from '@/constants/menu.constant';
import useLangClient from '@/hooks/use-lang-client';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import useAuthStore from '@/store/auth.store';
import useProfileStore from '@/store/profile/profile.store';
import useSidebarStore from '@/store/sidebar.store';
import { getLang } from '@/utils/locale.util';
import { LoginCurve, LogoutCurve } from 'iconsax-react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useQueryClient } from 'react-query';
import { authLogout } from '@/api/http/auth.service';
import SidebarProfile from './sidebar-profile';

export default function Sidebar() {
  // hooks
  const pathname = usePathname();
  const params = useParams();
  const { isOpen, onClose, onOpen, isShow, onShow } = useSidebarStore();
  const { width } = useWindowSize();
  // const router = useRouter();

  // state
  const [showLogout, setShowLogout] = useState<boolean>(false);

  // auth
  // const { mutate: onLogout } = useAuthLogout();
  const queryClient = useQueryClient();
  const { resetCredential } = useAuthStore();
  const { remove } = useProfileStore();
  const postLogout = () => {
    authLogout();
    Cookies.remove('kanzway-admin-cred');
    Cookies.remove('kanzway-admin-profile');
    resetCredential();
    remove();
    onClose();
    queryClient.invalidateQueries('getCustomerDetail');
    queryClient.removeQueries('getCustomerDetail');
    queryClient.clear();
    // router.replace(`/`);
    // router.refresh();
    window.location.replace('/');
    // onLogout(null, {
    //   onSuccess(_resp) {
    //     // console.log('checkResp', resp);
    //     // if (resp.code === HTTP_STATUS.SUCCESS) {
    //     Cookies.remove('kanzway-admin-cred');
    //     Cookies.remove('kanzway-admin-profile');
    //     resetCredential();
    //     remove();
    //     onClose();
    //     queryClient.invalidateQueries({
    //       queryKey: ['getDetailProfile'],
    //     });
    //     queryClient.removeQueries({
    //       queryKey: ['getDetailProfile'],
    //     });
    //     queryClient.clear();
    //     router.replace(`/`);
    //     router.refresh();
    //     // } else {
    //     //   toast.error(resp.message);
    //     // }
    //   },
    // });
  };

  // locale
  const t = useI18n();
  const { isAr } = useLangClient();

  // get actual pathname
  const actualPathName = useMemo<string>(() => {
    const arrPathname = pathname.split('/');
    arrPathname.splice(0, 2);
    return `/${arrPathname.join('/')}`;
  }, [pathname]);

  const toggleOpenSidebar = () => (isOpen ? onClose() : onOpen());

  useEffect(() => {
    if (width > 1024) {
      onClose();
    } else {
      onShow();
    }
  }, [width, onClose, onShow]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <>
      <div
        role="presentation"
        className={cn(
          ' fixed top-0 z-[49] h-screen w-fit bg-black/80 transition-all lg:top-20 lg:h-[calc(100vh-80px)]',
          { 'w-full': isOpen },
          { '-ml-[265px]': !isShow },
          { '-mr-[265px]': !isShow && isAr },
        )}
        onClick={toggleOpenSidebar}
      ></div>
      <div
        className={cn(
          ' fixed z-[50] -ml-[265px] h-screen w-[265px] bg-gray-900 transition-all duration-300 ease-in-out lg:top-20 lg:ml-0 lg:h-[calc(100vh-80px)]',
          { ' -mr-[265px] lg:mr-0': isAr },
          { 'mr-0': isOpen && isAr },
          { 'lg:-mr-[265px]': !isShow && isAr },
          { 'ml-0': isOpen },
          { 'lg:-ml-[265px]': !isShow },
        )}
      >
        <div className="flex h-full w-full flex-col">
          <SidebarProfile />

          <div className=" p-5">
            <div className=" relative">
              <FiSearch
                size={20}
                className=" absolute left-2.5 top-2.5 text-gray-500"
              />
              <Input
                className=" border-none bg-gray-800 pl-10 text-white ring-offset-transparent placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-transparent"
                placeholder={t('common.search')}
              />
            </div>
          </div>

          <div className=" no-scrollbar h-full flex-1 overflow-y-auto p-2.5 pt-0">
            <div className="flex flex-col gap-2.5">
              {SIDEBAR_MENU.map((menu) => (
                <Button
                  key={menu.title.en}
                  className={cn(' items-center justify-start gap-2.5 text-xs')}
                  variant={
                    (
                      menu.href === '/'
                        ? actualPathName === menu.href
                        : actualPathName.startsWith(menu.href)
                    )
                      ? 'default'
                      : 'ghost'
                  }
                  asChild
                >
                  <Link href={menu.href}>
                    <menu.icon size={20} />
                    {getLang(params, menu.title)}
                  </Link>
                </Button>
              ))}
              <Button
                className={cn(' items-center justify-start gap-2.5 text-xs')}
                variant="ghost"
                onClick={() => setShowLogout((prev) => !prev)}
              >
                <LoginCurve size={20} />
                {t('sidebar.menu.logout')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* begin: dialog logout */}
      <Dialog
        open={showLogout}
        onOpenChange={setShowLogout}
      >
        <DialogContent className=" max-w-md p-10">
          {/* begin: step confirmation delete */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className=" rounded-full bg-red-100 p-2">
              <LogoutCurve
                className=" text-red-500"
                size={20}
              />
            </div>

            <div className=" space-y-1 text-center">
              <p className=" font-medium text-neutral-800">Exit Confirmation</p>
              <p className=" text-center text-sm text-neutral-500">
                Ensure you save you work before leaving the dashboard
              </p>
            </div>
            <div className="flex gap-4">
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button onClick={() => postLogout()}>
                {t('sidebar.menu.logout')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* end: dialog logout */}
    </>
  );
}
