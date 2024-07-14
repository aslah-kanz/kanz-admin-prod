'use client';

import { useAuthOTPLogin } from '@/api/auth.api';
import { useGetProfile } from '@/api/profile.api';
import { Button } from '@/components/ui/button';
import { HTTP_STATUS } from '@/constants/common.constant';
import useWindowSize from '@/hooks/use-window-size';
import { useCurrentLocale } from '@/locales/client';
import useAuthStore from '@/store/auth.store';
import useDialogOtpLoginStore from '@/store/dialog-otp-login';
import useProfileStore from '@/store/profile/profile.store';
import { TAuthLoginResponse } from '@/types/auth.type';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { LuLoader2 } from 'react-icons/lu';
import OTPInput from 'react-otp-input';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '../ui/dialog';
import { Input } from '../ui/input';

export default function DialogOtpLogin() {
  const { isOpen, onClose, onOpen, loginRespons } = useDialogOtpLoginStore();
  const [otpCode, setOtp] = useState('');
  const [loadProfile, setLoadProfile] = useState<boolean>(false);
  const currentLocale = useCurrentLocale();
  const { width } = useWindowSize();

  const toggleShow = () => {
    setOtp('');
    return isOpen ? onClose() : onOpen();
  };

  const phoneNumber = `+${loginRespons?.principal.countryCode}${loginRespons?.principal.phoneNumber}`;
  const newPhoneNumber =
    phoneNumber.slice(0, 3) + phoneNumber.slice(2).replace(/.(?=...)/g, '*');

  const router = useRouter();

  const { setCredential } = useAuthStore();
  const { add: addProfile } = useProfileStore();
  const { data: _profile } = useGetProfile({
    enabled: loadProfile,
    onSuccess(resp) {
      addProfile(resp);
      toast.success('Login Successfully');
      router.replace(`/${currentLocale}`);
      router.refresh();
      toggleShow();
    },
  });

  const { mutate: save, isLoading: loading } = useAuthOTPLogin({
    onSuccess: (resp) => {
      // eslint-disable-next-line no-console
      console.log('checkLogin', resp);
      if (resp.code === HTTP_STATUS.SUCCESS) {
        if (loginRespons) {
          const newCreds: TAuthLoginResponse = {
            principal: loginRespons.principal,
            accessToken: resp.data,
            refreshToken: loginRespons.refreshToken,
          };
          setLoadProfile(true);
          setCredential(newCreds);
        }
      } else {
        setOtp('');
        // resetRespons();
        // onClose();
        toast.error(resp.message);
      }
    },
  });

  const onSend = useCallback(
    (otp: string) => {
      if (loginRespons) {
        save({
          payload: {
            code: otp,
          },
          token: loginRespons.accessToken.token,
        });
      }
    },
    [loginRespons, save],
  );

  const handleOnchange = (otp: string) => {
    setOtp(otp);
    // console.log('checkOtp', otp.length);
    // if (otp.length === 6) {
    //   onSend(otp);
    // }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        toggleShow();
        setOtp('');
      }}
    >
      <DialogContent
        className="max-w-[640px] px-10 py-14"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <form
          onSubmit={() => onSend(otpCode)}
          className="flex flex-col "
        >
          <div className=" flex flex-col gap-3 text-center">
            <h1 className=" text-2xl font-medium text-neutral-800">
              Secure Your Login: OTP Verification
            </h1>
            <p className=" text-base text-neutral-500">
              Please enter the verification code that we sent to{' '}
              <span className=" font-medium text-neutral-800">
                {newPhoneNumber}
              </span>{' '}
              to validate your account.
            </p>
          </div>
          <div className=" my-8">
            <p className=" text-center text-neutral-800">
              Type your 6 digit security code
            </p>
            <div
              className=" mt-4 flex justify-center gap-6"
              dir="ltr"
            >
              <OTPInput
                value={otpCode}
                onChange={(otp) => handleOnchange(otp)}
                numInputs={6}
                inputType="number"
                renderInput={(props) => (
                  <Input
                    {...props}
                    step="0.01"
                    className="test-sm w-10 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                )}
                inputStyle={{
                  width: width < 640 ? '30px' : '60px',
                  height: width < 640 ? '30px' : '60px',
                  padding: 0,
                }}
                containerStyle=" gap-5"
              />
            </div>
          </div>
          <Button
            className=" btn-blinking w-full"
            type="submit"
            disabled={loading}
            onClick={() => onSend(otpCode)}
            dir="ltr"
          >
            {loading && (
              <LuLoader2
                className=" animate-spin text-white"
                size={16}
              />
            )}
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
