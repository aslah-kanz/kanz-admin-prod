'use client';

import useLangClient from '@/hooks/use-lang-client';
import { cn } from '@/lib/utils';
import useSidebarStore from '@/store/sidebar.store';
import { HambergerMenu } from 'iconsax-react';
import Image from 'next/image';
import { FaArrowLeft } from 'react-icons/fa6';
import LangSwitch from './lang-switch';
import Notification from './notification';
import CountrySwitch from './country-switch';

type THeaderProps = {
  title: string;
};

export default function Header({ title }: THeaderProps) {
  const { onOpen, onShow, isShow, onHide } = useSidebarStore();
  const toggleOpenSidebar = () => (isShow ? onHide() : onShow());

  const { isAr } = useLangClient();
  return (
    <div
      className={cn(
        ' left-0 top-0 z-[47] flex h-fit w-screen flex-col items-center bg-white shadow-sm lg:fixed lg:h-20 lg:flex-row',
      )}
    >
      <div
        className={cn(
          ' fixed top-0 z-[48] flex w-full items-center justify-between bg-gray-900 p-4 transition-all lg:static lg:w-[265px] lg:p-6',
          // { 'bg-white': !isShow },
        )}
      >
        <div className={cn(' relative h-6 flex-1 lg:h-8')}>
          <Image
            src="/images/logo.svg"
            fill
            className={cn(' object-contain object-left', {
              'object-right': isAr,
            })}
            alt="logo"
          />
        </div>
        <button
          onClick={onOpen}
          className=" block lg:hidden"
        >
          <HambergerMenu
            className=" text-white hover:text-primary"
            size={24}
          />
        </button>
        <button
          className=" hidden lg:block"
          onClick={toggleOpenSidebar}
        >
          <FaArrowLeft
            className={cn(
              ' text-white transition-all',
              { 'rotate-180': isAr },
              {
                'rotate-180': !isShow,
              },
              {
                ' rotate-0': !isShow && isAr,
              },
            )}
          />
        </button>
      </div>
      <div className="flex w-full flex-1 items-center justify-between p-4 lg:h-20 lg:p-6">
        <div className="flex items-center gap-2">
          <h1 className=" text-[26px] font-medium">{title}</h1>
        </div>
        <div className="flex items-center gap-8">
          <Notification side={isAr ? 'start' : 'end'} />
          <CountrySwitch side={isAr ? 'start' : 'end'} />
          <LangSwitch side={isAr ? 'start' : 'end'} />
        </div>
      </div>
    </div>
  );
}
