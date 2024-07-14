'use client';

import { useDeleteBank, useGetAllBank } from '@/api/bank.api';
import SheetAddBank from '@/components/bank/sheet-add-bank';
import EmptyState from '@/components/common/empty-state';
import DialogOtp from '@/components/dialog/dialog-otp';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { HTTP_STATUS } from '@/constants/common.constant';
import useDebounce from '@/hooks/use-debounce';
import useDialogOtpStore from '@/store/dialog-otp.store';
import useModalAddBankStore from '@/store/modal-add-bank.store';
import { Eye, EyeSlash, Warning2 } from 'iconsax-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function ManageBankAccountPage() {
  // const [isShowEditBankAccount, setIsShowEditBankAccount] =
  //   useState<boolean>(false);
  // const [isShowAddBankAccount, setIsShowAddBankAccount] =
  //   useState<boolean>(false);
  const [isShowDeleteBankAccount, setIsShowDeleteBankAccount] =
    useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [step, setStep] = useState<
    'confirmation' | 'password' | 'phone_number'
  >('confirmation');
  const { onOpen: onOpenDialogOtp } = useDialogOtpStore();

  const {
    isOpen,
    onChangeOpen: openAddBank,
    setInitialValue,
  } = useModalAddBankStore();

  const [selectedId, setSelectedId] = useState<number>(0);
  const [searchValue, setSearchValue] = useState('');
  const [search, setSearch] = useState(searchValue);
  const debounceSearch = useDebounce(search, 500);

  const searchParams = useSearchParams();

  const urlSearchParams = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );

  const currentPage =
    typeof urlSearchParams.get('page') === 'string'
      ? Number(urlSearchParams.get('page'))
      : 1;

  const { data: bankData } = useGetAllBank({
    search: debounceSearch,
    page: currentPage,
  });

  const toggleShowDeleteBankAccount = () => {
    setIsShowDeleteBankAccount((prev) => !prev);
  };

  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  const { mutate } = useDeleteBank();

  const queryClient = useQueryClient();
  const router = useRouter();
  const deleteBank = useCallback(() => {
    // console.log('checkID', selectedId)
    mutate(selectedId, {
      onSuccess(resp) {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Bank Deleted');
          queryClient.invalidateQueries({
            queryKey: ['getAllBank'],
          });
          router.push('/profile/bank-account');
          setIsShowDeleteBankAccount((prev) => !prev);
          router.refresh();
        } else {
          toast.error(resp.message);
        }
      },
    });
  }, [mutate, queryClient, router, selectedId]);

  return (
    <>
      <div className=" flex h-full w-full flex-col rounded-lg border">
        <div className=" border-b p-5">
          <p className=" text-lg font-medium text-neutral-800">Bank Account</p>
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
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setSearch(e.target.value);
                }}
              />
            </div>
            <Button onClick={() => openAddBank(!isOpen)}>Add new bank</Button>
          </div>
          {bankData && bankData.content.length > 0 ? (
            bankData.content.map((items) => (
              <div
                className="mt-8 flex flex-col"
                key={Math.random()}
              >
                <div className=" w-full rounded-lg border p-4">
                  <p className=" text-lg font-medium text-neutral-800">
                    {items.beneficiaryName}
                  </p>

                  <div className="mt-2 flex flex-col gap-2">
                    <p className=" font-medium text-neutral-800">
                      {items.name}
                    </p>
                    <p className=" text-sm text-neutral-800">
                      {items.accountNumber}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2.5">
                    <Button
                      onClick={() => {
                        setInitialValue(items);
                        openAddBank(true);
                      }}
                    >
                      Edit Bank
                    </Button>

                    <Button
                      variant="ghost"
                      className=" text-primary"
                      onClick={() => {
                        setSelectedId(items.id);
                        setIsShowDeleteBankAccount((prev) => !prev);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState description="We couldn't find any bank account, please add new bank account." />
          )}
        </div>
      </div>

      {/* begin: drawer add store */}
      <SheetAddBank />

      {/* begin: dialog delete address */}
      <Dialog
        open={isShowDeleteBankAccount}
        onOpenChange={toggleShowDeleteBankAccount}
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
                <p className=" font-medium text-neutral-800">Are you sure?</p>
                <p className=" text-center text-sm text-neutral-500">
                  Are you sure you want to delete this bank? This action is
                  irreversible.
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={toggleShowDeleteBankAccount}
                >
                  Cancel
                </Button>
                <Button onClick={() => deleteBank()}>Delete bank</Button>
                {/* <Button onClick={() => setStep('password')}>Delete bank</Button> */}
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
                  To verify and proceed with bank deletion, please enter your
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
                  To verify and proceed with bank deletion, please enter your
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
                    toggleShowDeleteBankAccount();
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
    </>
  );
}
