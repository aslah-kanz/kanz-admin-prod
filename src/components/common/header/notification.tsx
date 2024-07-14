'use client';

import {
  useGetNotification,
  useReadNotification,
} from '@/api/notification.api';
import { HTTP_STATUS } from '@/constants/common.constant';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { TNotification } from '@/types/notification.type';
import { intlFormatDistance } from 'date-fns';
import { Notification as NotificationIcon } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

type TNotificationProps = {
  side?: 'start' | 'end';
};

export default function Notification({ side = 'start' }: TNotificationProps) {
  const router = useRouter();
  const t = useI18n();

  const { data: notificationList } = useGetNotification();
  const { mutate: readNotif } = useReadNotification();

  // const FAKE_NOTIFICATION: TNotification[] = [
  //   {
  //     id: 1,
  //     title: {
  //       en: 'New order #INV122',
  //       ar: 'لقد تم قبول طلبك',
  //     },
  //     message: {
  //       en: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
  //       ar: 'مثقاب أرضي فرعي بزاوية خطوة متضمنة تبلغ 90 درجة، وساق مستقيمة وقطر دليل الحفر 8.40 مم وطول 19.00 مم، وقطر كبير 15.00 مم وطول إجمالي 169 مم، وفقًا لمعيار DIN 8374 لإنتاج توافق قريب من خلال الفتحة والمقعد المخروطي للبراغي ذات الرأس الغاطسة M8، وتشطيب HSS والمعالجة بالبخار للتصنيع الحر، والكربون العادي وسبائك الفولاذ والحديد الزهر الرمادي',
  //     },
  //     image: {
  //       id: 1,
  //       name: 'dormer-a100-primary-angle2.png',
  //       url: 'https://picsum.photos/800/600',
  //       width: 800,
  //       height: 600,
  //       type: 'image',
  //     },
  //     type: 'order',
  //     referenceId: 1,
  //     createdAt: '2024-02-20 13:51:50',
  //     readAt: null,
  //   },
  //   {
  //     id: 2,
  //     title: {
  //       en: 'Your order has been accepted',
  //       ar: 'لقد تم قبول طلبك',
  //     },
  //     message: {
  //       en: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
  //       ar: 'مثقاب أرضي فرعي بزاوية خطوة متضمنة تبلغ 90 درجة، وساق مستقيمة وقطر دليل الحفر 8.40 مم وطول 19.00 مم، وقطر كبير 15.00 مم وطول إجمالي 169 مم، وفقًا لمعيار DIN 8374 لإنتاج توافق قريب من خلال الفتحة والمقعد المخروطي للبراغي ذات الرأس الغاطسة M8، وتشطيب HSS والمعالجة بالبخار للتصنيع الحر، والكربون العادي وسبائك الفولاذ والحديد الزهر الرمادي',
  //     },
  //     image: {
  //       id: 1,
  //       name: 'dormer-a100-primary-angle2.png',
  //       url: 'https://picsum.photos/800/600',
  //       width: 800,
  //       height: 600,
  //       type: 'image',
  //     },
  //     type: 'order',
  //     referenceId: 1,
  //     createdAt: '2024-02-20 13:51:50',
  //     readAt: '2024-02-20 13:51:50',
  //   },
  // ];

  const unread: number =
    notificationList?.content?.filter((items) => items.readAt === null)
      .length ?? 0;

  const queryClient = useQueryClient();
  const handleClick = (item: TNotification) => {
    readNotif(item.id, {
      onSuccess: (resp) => {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          queryClient.removeQueries('getNotification');
          switch (item.type) {
            case 'purchaseQuote':
            case 'order':
              router.push('/order-management');
              break;

            default:
              break;
          }
        } else {
          toast.error(resp.message);
        }
      },
    });
  };

  return (
    <div className=" group relative w-fit">
      <button
        type="button"
        className="relative inline-flex items-center rounded-full p-1 text-center text-sm font-medium text-neutral-800"
      >
        <NotificationIcon size={20} />
        <span className="sr-only">Notifications</span>
        {unread > 0 && (
          <div className="absolute -end-1 -top-1 inline-flex items-center justify-center rounded-full border-2 border-white bg-primary px-1.5 py-[2px] text-[10px] font-thin leading-none text-white dark:border-gray-900">
            {unread <= 9 ? unread : '9+'}
          </div>
        )}
      </button>
      <div
        className={cn(
          ' invisible absolute z-[50] flex max-h-80 w-[400px] overflow-auto rounded-lg border bg-white opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100',
          { 'right-0': side === 'end' },
          { 'left-0': side === 'start' },
        )}
        dir="ltr"
      >
        <div>
          <div className="flex-1">
            <div className="grid grid-cols-1 divide-y">
              {notificationList && notificationList.content?.length > 0 ? (
                notificationList.content.map((items) => (
                  <button
                    className={`${items.readAt ? 'bg-white' : 'bg-sky-100'} w-full px-6 py-4`}
                    key={Math.random()}
                    onClick={() => handleClick(items)}
                  >
                    <div className=" inline-flex w-full items-center justify-between">
                      <div className="inline-flex items-center">
                        {items.image && (
                          <div className="relative mr-4 aspect-square w-20 overflow-hidden rounded-md">
                            <Image
                              src={items.image.url}
                              fill
                              alt=""
                              className="rounded-md object-contain object-center"
                            />
                          </div>
                        )}
                        <div className="w-full overflow-hidden truncate text-wrap text-left">
                          <h3 className="truncate text-base font-bold text-gray-800 ">
                            {items.title}
                          </h3>
                          <p className="mt-1 line-clamp-3 truncate text-wrap text-sm">
                            {items.message}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-left text-xs text-gray-500">
                      {intlFormatDistance(items.createdAt, Date.now())}
                    </p>
                  </button>
                ))
              ) : (
                <button className="w-full bg-white px-6 py-4">
                  <div className=" inline-flex w-full items-center justify-between">
                    <div className="inline-flex items-center">
                      <div className="w-full overflow-hidden truncate text-wrap text-left">
                        <p className="mt-1 line-clamp-3 truncate text-wrap text-sm">
                          {t('common.noNotification')}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
