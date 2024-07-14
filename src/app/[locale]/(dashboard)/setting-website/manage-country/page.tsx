'use client';

import { useDeleteCountry, useGetCountries } from '@/api/country.api';
import EmptyState from '@/components/common/empty-state';
import DialogDelete from '@/components/dialog/dialog-delete';
import SheetAddCountry from '@/components/setting-website/sheet-add-country';
import SheetEditCountry from '@/components/setting-website/sheet-edit-country';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { HTTP_STATUS } from '@/constants/common.constant';
import { useI18n } from '@/locales/client';
import { TDefaultPageParams } from '@/types/common.type';
import { TCountry } from '@/types/country.type';
import { textTruncate } from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import Image from 'next/image';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function CertificationManagementPage({
  params,
  searchParams,
}: TDefaultPageParams) {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();

  // state
  const [showAddCountry, setShowAddCountry] = useState<boolean>(false);
  const [showEditCountry, setShowEditCountry] = useState<boolean>(false);
  const [showDeleteCountry, setShowDeleteCountry] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<TCountry | undefined>(
    undefined,
  );

  // fetch
  const { data: countries, isLoading } = useGetCountries({
    search: searchParams.search,
    order: 'desc',
    sort: 'createdAt',
  });

  // mutation
  const { mutate: deleteCountry, isLoading: loadingDeleteCountry } =
    useDeleteCountry({
      onSuccess: (resp) => {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Success to delete country');
          queryClient.invalidateQueries({ queryKey: ['countries'] });
          setShowDeleteCountry((prev) => !prev);
        } else {
          toast.success('Failed to delete country', {
            description: resp.message,
          });
        }
      },
    });

  // handle delete
  const handleDelete = () => {
    if (selectedCountry) {
      deleteCountry(selectedCountry.id);
      setSelectedCountry(undefined);
    }
  };
  return (
    <>
      <div className=" h-full w-full">
        <div className=" w-full rounded-b-lg border border-t-0 p-4">
          {/* begin: filter, search and action */}
          <div className="flex items-center justify-end ">
            <Button
              variant="destructive"
              onClick={() => setShowAddCountry((prev) => !prev)}
            >
              {t('settingWebsite.addCountry')}
            </Button>
          </div>
          {/* end: filter, search and action */}

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-lg border"
                >
                  <div className=" flex flex-1 gap-4 border-b p-4">
                    <Skeleton className=" h-[86px] w-[108px]" />
                    <div className="flex flex-col">
                      <Skeleton className=" h-6 w-16" />
                      <div className=" mt-3 space-y-1">
                        <Skeleton className=" h-4 w-24" />
                        <Skeleton className=" h-4 w-10" />
                      </div>
                      <div className=" mt-2 space-y-1">
                        <Skeleton className=" h-4 w-24" />
                        <Skeleton className=" h-4 w-10" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 p-4">
                    <Skeleton className=" h-8 w-12" />
                    <Skeleton className=" h-8 w-12" />
                  </div>
                </div>
              ))
            ) : countries && countries.length > 0 ? (
              countries.map((country) => (
                <div
                  key={country.id}
                  className=" flex flex-col rounded-lg border"
                >
                  <div className=" flex flex-1 items-start gap-4 p-4">
                    <div className=" relative aspect-[2/1] h-[86px] w-[108px] overflow-hidden rounded-md border">
                      <Image
                        src={country.image.url}
                        fill
                        alt={country.image.name}
                        className=" object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className=" text-lg font-medium text-neutral-800">
                        {textTruncate(getLang(params, country.name), 25)}
                      </p>
                      <div className=" mt-2">
                        <p className="  text-sm font-medium text-neutral-800">
                          {t('common.countryCode')}
                        </p>
                        <p className=" text-xs text-neutral-500">
                          {country.code}
                        </p>
                        <p className="  mt-2 text-sm font-medium text-neutral-800">
                          {t('common.phoneCode')}
                        </p>
                        <p className=" text-xs text-neutral-500">
                          {country.phoneCode}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className=" flex justify-end gap-2 border-t p-4">
                    <Button
                      size="sm"
                      variant="ghost-primary"
                      onClick={() => {
                        setSelectedCountry(country);
                        setShowDeleteCountry((prev) => !prev);
                      }}
                    >
                      {t('common.delete')}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedCountry(country);
                        setShowEditCountry((prev) => !prev);
                      }}
                    >
                      {t('common.edit')}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState description="No country found" />
            )}
          </div>
        </div>
      </div>

      <SheetAddCountry
        open={showAddCountry}
        setOpen={setShowAddCountry}
      />

      <SheetEditCountry
        open={showEditCountry}
        setOpen={setShowEditCountry}
        country={selectedCountry}
      />

      <DialogDelete
        open={showDeleteCountry}
        onOpenChange={setShowDeleteCountry}
        onDelete={handleDelete}
        isLoading={loadingDeleteCountry}
      />
    </>
  );
}
