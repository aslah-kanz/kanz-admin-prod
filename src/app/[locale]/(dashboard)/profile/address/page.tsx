'use client';

import { useDeleteAddress, useGetAddresses } from '@/api/address.api';
import SheetAddAddress from '@/components/address/sheet-add-address';
import EmptyState from '@/components/common/empty-state';
import DialogOtp from '@/components/dialog/dialog-otp';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HTTP_STATUS } from '@/constants/common.constant';
import useDialogOtpStore from '@/store/dialog-otp.store';
import useModalAddAddressStore from '@/store/modal-add-address.store';
import { Eye, EyeSlash, Warning2 } from 'iconsax-react';
import { ReactNode, useCallback, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { PiWarningCircle } from 'react-icons/pi';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function ManageAddressPage() {
  const [selectedId, setSelectedId] = useState<number>(0);
  // const [isShowAddStore, setIsShowAddStore] = useState<boolean>(false);
  // const [isShowEditStore, setIsShowEditStore] = useState<boolean>(false);
  const [isShowDeleteStore, setIsShowDeleteStore] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [step, setStep] = useState<
    'confirmation' | 'password' | 'phone_number'
  >('confirmation');
  // const [latLang, setLatLang] = useState<
  //   google.maps.LatLng | google.maps.LatLngLiteral | null
  // >(null);

  const {
    isOpen,
    onChangeOpen: openAddAddress,
    setInitialValue,
  } = useModalAddAddressStore();

  const toggleShowDeleteStore = () => {
    setIsShowDeleteStore((prev) => !prev);
  };

  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  const { onOpen: onOpenDialogOtp } = useDialogOtpStore();

  const { data: address } = useGetAddresses();

  const { mutate } = useDeleteAddress();

  const queryClient = useQueryClient();
  const deleteAddress = useCallback(() => {
    mutate(selectedId, {
      onSuccess(resp) {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Address Deleted');
          queryClient.invalidateQueries({
            queryKey: ['getShippingAddresses'],
          });
          setIsShowDeleteStore((prev) => !prev);
        } else {
          toast.error(resp.message);
        }
      },
    });
  }, [mutate, queryClient, selectedId]);

  const renderAddressList = () => {
    let renderedList: ReactNode = '';
    if (address?.data.content.length === 0) {
      renderedList = (
        <EmptyState description="We couldn't find any address, please add new address." />
      );
    } else {
      renderedList = address?.data.content.map((items) => (
        <div
          className="mt-8 flex flex-col"
          key={Math.random()}
        >
          <div className=" w-full rounded-lg border p-4">
            <div className="mt-2 flex flex-col gap-2">
              <p className=" font-medium text-neutral-800">{items.name}</p>
              <p className=" text-sm text-neutral-800">{items.address}</p>
            </div>
            <div className="mt-4 flex gap-2.5">
              <Button
                onClick={() => {
                  openAddAddress(!isOpen);
                  setInitialValue(items);
                }}
              >
                Edit Address
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success('Your request has been send.', {
                      description:
                        'Your request for fulfillment has been sent, please wait for approval your address from kanzway admin.',
                    });
                  }}
                >
                  Request fulfillment
                </Button>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger>
                      <PiWarningCircle size={16} />
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className=" max-w-[200px] "
                      align="center"
                    >
                      <TooltipArrow className=" " />
                      <p className=" text-center text-[10px] ">
                        Request fulfillment if you capable to sell product from
                        your warehouse to other country (this action need
                        approval from KanzWay admin).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button
                variant="ghost"
                className=" text-primary"
                onClick={() => {
                  setSelectedId(items.id!);
                  setIsShowDeleteStore((prev) => !prev);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ));
    }

    return renderedList;
  };

  return (
    <>
      <div className=" flex h-full w-full flex-col rounded-lg border">
        <div className=" border-b p-5">
          <p className=" text-lg font-medium text-neutral-800">Address</p>
        </div>
        <div className=" h-full w-full p-5">
          <div className="flex items-center justify-between">
            <div className=" relative">
              <FiSearch
                size={16}
                className=" absolute left-3 top-3 text-gray-500"
              />
              <Input
                className=" w-full border bg-white pl-10 ring-offset-transparent placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-transparent xl:w-64"
                placeholder="Search"
              />
            </div>
            <Button onClick={() => openAddAddress(!isOpen)}>
              Add new address
            </Button>
          </div>
          {renderAddressList()}

          {/* begin: empty state */}
          {/* <EmptyState description="We couldn't find any address, please add new address." /> */}
          {/* end: empty state */}
        </div>
      </div>

      {/* begin: dialog delete address */}
      <Dialog
        open={isShowDeleteStore}
        onOpenChange={toggleShowDeleteStore}
      >
        <DialogContent className=" max-w-md p-10">
          {/* begin: step confirmation delete */}
          {step === 'confirmation' && (
            <div className="flex flex-col items-center justify-center gap-4">
              <div className=" rounded-full bg-red-200 p-2">
                <Warning2
                  className=" text-red-500"
                  size={20}
                />
              </div>

              <div className=" space-y-1 text-center">
                <p className=" font-medium text-neutral-800">Delete Address?</p>
                <p className=" text-center text-sm text-neutral-500">
                  Are you sure you want to delete this address? This action is
                  irreversible.
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={toggleShowDeleteStore}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    deleteAddress();
                  }}
                >
                  Delete address
                </Button>
              </div>
            </div>
          )}
          {/* end: step confirmation delete */}

          {/* begin: step verify password */}
          {step === 'password' && (
            <div className="flex flex-col items-center justify-center gap-4">
              <div className=" rounded-full bg-red-200 p-2">
                <Warning2
                  className=" text-red-500"
                  size={20}
                />
              </div>

              <div className=" space-y-1 text-center">
                <p className=" font-medium text-neutral-800">
                  Verify it&apos;s you
                </p>
                <p className=" text-center text-sm text-neutral-500">
                  To verify and proceed with address deletion, please enter your
                  password.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2">
                <div className=" relative">
                  <button
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-3"
                  >
                    {isShowPassword ? (
                      <EyeSlash
                        size={16}
                        className="  text-gray-500"
                      />
                    ) : (
                      <Eye
                        size={16}
                        className="  text-gray-500"
                      />
                    )}
                  </button>
                  <Input
                    className=" w-full border bg-white pr-10 ring-offset-transparent placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-transparent"
                    placeholder="Search store"
                    defaultValue="password"
                    type={isShowPassword ? 'text' : 'password'}
                  />
                </div>
                <Button onClick={() => setStep('phone_number')}>Next</Button>
              </div>
            </div>
          )}
          {/* end: step verify password */}

          {/* begin: step verify phone number */}
          {step === 'phone_number' && (
            <div className="flex flex-col items-center justify-center gap-4">
              <div className=" rounded-full bg-red-200 p-2">
                <Warning2
                  className=" text-red-500"
                  size={20}
                />
              </div>

              <div className=" space-y-1 text-center">
                <p className=" font-medium text-neutral-800">One step closer</p>
                <p className=" text-center text-sm text-neutral-500">
                  To verify and proceed with address deletion, please enter your
                  phone number. We&apos;ll send a verification code via SMS for
                  confirmation. Thank you.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2">
                <Input
                  className=" w-full border bg-white pr-10 placeholder:text-gray-500 "
                  placeholder="Search store"
                  defaultValue="9668820177463"
                />
                <Button
                  onClick={() => {
                    setTimeout(() => setStep('confirmation'), 300);
                    toggleShowDeleteStore();
                    onOpenDialogOtp();
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          {/* end: step verify phone number */}
        </DialogContent>
      </Dialog>
      {/* end: dialog delete address */}

      <DialogOtp />

      {/* begin: drawer add addres */}
      <SheetAddAddress />
      {/* end: drawer add store */}
    </>
  );
}
