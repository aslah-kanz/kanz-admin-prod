'use client';

import React, { useState } from 'react';
import useDialogOtpStore from '@/store/dialog-otp.store';
import OTPInput from 'react-otp-input';
import { Dialog, DialogContent } from '../ui/dialog';
import { Input } from '../ui/input';

export default function DialogOtp() {
  const { isOpen, onClose, onOpen } = useDialogOtpStore();
  const [otp, setOtp] = useState('');

  const toggleShow = () => {
    return isOpen ? onClose() : onOpen();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={toggleShow}
    >
      <DialogContent className=" max-w-[640px] px-10 py-14">
        <div className="flex flex-col">
          <div className=" flex flex-col gap-3 text-center">
            <h1 className=" text-2xl font-medium text-neutral-800">
              Secure Your Reset: OTP Verification
            </h1>
            <p className=" text-base text-neutral-500">
              Enter the One-Time Passcode (OTP) Sent to Your Registered{' '}
              <span className=" font-medium text-neutral-800">
                +966 *******63
              </span>{' '}
              for Password Reset Confirmation
            </p>
          </div>
          <div className=" mt-8">
            <p className=" text-center text-neutral-800">
              Type your 6 digit security code
            </p>
            <div className=" mt-4 flex justify-center gap-6">
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props) => (
                  <Input
                    {...props}
                    className=" w-10"
                  />
                )}
                inputStyle={{ width: '60px', height: '60px' }}
                containerStyle=" gap-5"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
