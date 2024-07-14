'use client';

import { useGetProfile } from '@/api/profile.api';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Setting2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useAuthLogout } from '@/api/auth.api';
import { useQueryClient } from 'react-query';
import useAuthStore from '@/store/auth.store';
import useProfileStore from '@/store/profile/profile.store';
import { useRouter } from 'next/navigation';

export default function SidebarProfile() {
  const [name, setName] = useState('');
  const [profilPic, setProfilPic] = useState('https://picsum.photos/200/300');
  // const { profile } = useProfileStore();
  const { data: profile } = useGetProfile();
  const { mutate } = useAuthLogout();

  const queryClient = useQueryClient();
  const router = useRouter();
  const { resetCredential } = useAuthStore();
  const { remove } = useProfileStore();

  useEffect(() => {
    if (profile) {
      if (profile.type) {
        const newName = `${profile?.firstName} ${profile?.lastName}`;
        setName(newName);
        setProfilPic(profile?.image?.url ?? 'https://picsum.photos/200/300');
      } else {
        mutate(null, {
          onSuccess(_resp) {
            // if (resp.code === HTTP_STATUS.SUCCESS) {
            Cookies.remove('kanzway-vendor-cred');
            Cookies.remove('kanzway-vendor-profile');
            resetCredential();
            remove();
            queryClient.invalidateQueries({
              queryKey: ['getCustomerDetail'],
            });
            queryClient.removeQueries({
              queryKey: ['getCustomerDetail'],
            });
            queryClient.clear();
            router.replace(`/`);
            router.refresh();
            // } else {
            //   toast.error(resp.message);
            // }
          },
        });
      }
    }
  }, [mutate, profile, queryClient, remove, resetCredential, router]);

  return (
    <div className=" flex items-start justify-between gap-4 border-b border-b-gray-800 p-5">
      <div className="flex gap-4">
        <div className=" relative aspect-square h-12 overflow-hidden rounded-lg">
          <Image
            src={profilPic}
            className=" object-cover object-center"
            quality={30}
            // height={48}
            // width={48}
            alt=""
            fill
          />
        </div>
        <div className="flex flex-col">
          <p className=" text-sm font-medium text-white">{name}</p>
          {/* <p className=" mt-1 text-[10px] text-gray-400">Manufacturer</p> */}
          <p className=" text-[9px] text-green-600">• online</p>
        </div>
      </div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>
            <Link href="/profile">
              <Setting2
                variant="Bulk"
                className=" text-gray-400"
                size={20}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Profile Detail</p>
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* <Popover>
        <PopoverTrigger>
          <Setting2
            variant="Bulk"
            className=" text-gray-400"
            size={20}
          />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="right"
          className=" p-0"
        >
          <div className="flex gap-4 border-b p-4">
            <div className=" relative aspect-square h-12 overflow-hidden rounded-lg">
              <Image
                src="/images/49.png"
                className=" object-cover object-center"
                alt=""
                fill
              />
            </div>
            <div className="flex flex-col">
              <p className=" text-sm font-medium text-neutral-800">
                Paul Melone
              </p>
              <p className=" text-xs text-gray-500">Seller</p>
              <p className=" text-[10px] text-green-600">• online</p>
            </div>
          </div>
          <div className=" flex flex-col p-4">
            <PopoverClose asChild>
              <Button
                variant="ghost"
                className=" justify-start"
                asChild
              >
                <Link href="/profile">My Profile</Link>
              </Button>
            </PopoverClose>
            <Button
              variant="ghost"
              className=" justify-start"
            >
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover> */}
    </div>
  );
}
