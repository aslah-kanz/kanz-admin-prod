'use client';

import React, { useState } from 'react';
import { Eye, EyeSlash, Warning2 } from 'iconsax-react';
import useDialogConfirmationDeleteStore from '@/store/dialog-confirmation-delete.store';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type TDialogConfirmationDelete = {
  stepNumber: 3 | 2;
  type: string;
};

export default function DialogConfirmationDelete({
  stepNumber = 3,
  type,
}: TDialogConfirmationDelete) {
  const { isOpen, onClose, onOpen } = useDialogConfirmationDeleteStore();
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [step, setStep] = useState<
    'confirmation' | 'password' | 'phone-number'
  >('confirmation');

  const toggleShowDeleteStore = () => (isOpen ? onClose() : onOpen);

  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={toggleShowDeleteStore}
    >
      <DialogContent className=" max-w-md p-10">
        {/* begin: step confirmation delete */}
        {step === 'confirmation' && stepNumber === 3 && (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className=" rounded-full bg-red-200 p-2">
              <Warning2
                className=" text-red-500"
                size={20}
              />
            </div>

            <div className=" space-y-1 text-center">
              <p className=" font-medium capitalize text-neutral-800">
                Delete {type}?
              </p>
              <p className=" text-center text-sm text-neutral-500">
                Are you sure you want to delete this {type}? This action is
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
              <Button onClick={() => setStep('password')}>Delete {type}</Button>
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
                To verify and proceed with {type} deletion, please enter your
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
              <Button onClick={() => setStep('phone-number')}>Next</Button>
            </div>
          </div>
        )}
        {/* end: step verify password */}

        {/* begin: step verify phone number */}
        {step === 'phone-number' && (
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
                To verify and proceed with {type} deletion, please enter your
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
                  toggleShowDeleteStore();
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
  );
}
