'use client';

import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useI18n } from '@/locales/client';
import { TAuthRegisterLinkItem } from '@/types/auth.type';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';

export default function RegisterPage() {
  const REGISTER_LINK_TYPES: Array<TAuthRegisterLinkItem> = [
    {
      label: 'individual',
      route: '/register/individual',
      tooltipText: 'tooltipIndividual',
    },
    {
      label: 'company',
      route: '/register/company',
      tooltipText: 'tooltipCompany',
    },
    {
      label: 'manufacture',
      route: '/register/manufacture',
      tooltipText: 'tooltipManufacture',
    },
    {
      label: 'seller',
      route: '/register/seller',
      tooltipText: 'tooltipSeller',
    },
  ];

  const t = useI18n();
  return (
    <div className=" h-full w-full">
      <div className=" mx-auto w-full max-w-md">
        <div className=" flex flex-col gap-3 text-center ">
          <h1 className=" text-2xl font-medium text-neutral-800">
            {t('register.title')}
          </h1>
          <p className=" text-base text-neutral-500">
            {t('register.subTitle')}
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-6">
          {REGISTER_LINK_TYPES.map((item) => (
            <TooltipProvider
              key={item.label}
              delayDuration={0}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.route}
                    className=" flex h-20 w-full items-center justify-between rounded-lg border px-6 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className=" relative flex aspect-square h-12 items-center justify-center rounded-full bg-primary">
                        <div className=" relative aspect-square h-5">
                          <Image
                            src="/images/user.svg"
                            className=" object-contain object-center"
                            fill
                            alt=""
                          />
                        </div>
                      </div>
                      <p className=" font-medium capitalize text-neutral-800">
                        {/* @ts-expect-error */}
                        {t(`register.registerLinkType.${item.label}` as any)}
                      </p>
                    </div>
                    <FaChevronRight />
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="right"
                >
                  <TooltipArrow className="TooltipArrow transition-none delay-0 duration-0" />
                  <p>
                    {/* @ts-expect-error */}
                    {t(`register.registerLinkType.${item.tooltipText}` as any)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        <p className=" mt-10 text-center text-sm font-medium text-neutral-800">
          Already have an account?{' '}
          <Link
            className=" text-primary"
            href="/login"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
