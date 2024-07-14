import LangSwitch from '@/components/common/header/lang-switch';
import CountrySwitch from '@/components/common/header/country-switch';
import { useLangServer } from '@/hooks/use-lang-server';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAr } = await useLangServer();
  return (
    <div className=" min-h-screen w-full">
      {/* begin: auth image */}
      <div
        className={cn(
          ' fixed top-0 hidden h-screen w-2/5 lg:block',
          isAr ? 'left-0' : 'right-0',
        )}
        dir="rtl"
      >
        <div className=" relative h-full w-full overflow-hidden">
          <Image
            src="/images/background-auth.png"
            fill
            alt=""
            className=" object-cover object-center"
          />
        </div>
      </div>
      {/* end: auth image */}
      <div className=" flex min-h-screen w-full flex-col gap-8 overflow-hidden p-6 md:w-screen lg:w-3/5">
        <div className="flex flex-col">
          <div className="flex gap-4">
            <CountrySwitch side={isAr ? 'end' : 'start'} />
            <LangSwitch side={isAr ? 'end' : 'start'} />
          </div>
          <div className=" flex justify-center">
            <div className=" relative h-10 w-32">
              <Image
                src="/images/logo.svg"
                fill
                alt="logo"
                className=" content-center object-contain"
              />
            </div>
          </div>
        </div>

        {/* begin: main content */}
        <div className=" flex flex-1 flex-col items-center justify-center pb-16">
          {children}
        </div>
        {/* end: main content */}
      </div>
    </div>
  );
}
