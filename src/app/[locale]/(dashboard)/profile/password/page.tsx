'use client';

import { useUpdatePassword } from '@/api/profile.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HTTP_STATUS } from '@/constants/common.constant';
import { useI18n } from '@/locales/client';
import { TEditPassword } from '@/types/profile.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeSlash } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import OTPInput from 'react-otp-input';
import { toast } from 'sonner';
import * as yup from 'yup';

const schema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('required')
    .min(8)
    .matches(
      /^[^\s\u{1F600}-\u{1F64F}]*$/u,
      'Password cannot contain spaces or emojis',
    )
    .label('Current Password'),
  newPassword: yup
    .string()
    .required('required')
    .matches(
      /^[^\s\u{1F600}-\u{1F64F}]*$/u,
      'Password cannot contain spaces or emojis',
    )
    .label('New Password'),
  passwordConfirmation: yup
    .string()
    .required('required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .matches(
      /^[^\s\u{1F600}-\u{1F64F}]*$/u,
      'Password cannot contain spaces or emojis',
    )
    .label('Confirm New Password'),
});

export default function UpdatePasswordPage() {
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isValidate, setIsValidate] = useState<boolean>(false);

  const t = useI18n();

  const toggleShow = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setter((prev) => !prev);
  };
  const [isShowOtp, setIsShowOtp] = useState<boolean>(false);
  const [otp, setOtp] = useState('');

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    // resetField,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      passwordConfirmation: '',
    },
  });

  const router = useRouter();

  const { mutate, isLoading: loading } = useUpdatePassword({
    onSuccess: (resp) => {
      // console.log('checkResp', resp);
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Password Updated');
        reset();
        router.refresh();
      } else {
        toast.error(resp.message);
      }
    },
  });

  const handleActualSubmit: SubmitHandler<TEditPassword> = useCallback(
    (values: TEditPassword) => {
      // console.log('checkValueees', values)
      mutate(values);
    },
    [mutate],
  );

  const handleOnchangeOtp = (otp: string) => {
    setOtp(otp);
    setIsValidate(false);
    // console.log('checkOtp', otp.length);
    if (otp.length === 6) {
      setIsShowOtp(false);
      setOtp('');
      setIsValidate(true);
    }
  };

  const submitUpdatePassword = useRef<HTMLButtonElement | null>(null);

  const handleTriggerUpdate = () => {
    if (submitUpdatePassword.current) {
      submitUpdatePassword.current.click();
    }
  };

  useEffect(() => {
    if (isValidate) {
      handleTriggerUpdate();
    }
  }, [isValidate]);

  return (
    <div className=" flex h-full w-full flex-col rounded-lg border">
      <div className=" w-full border-b p-5">
        <h1 className=" text-lg font-medium text-neutral-800">
          {t('profile.updatePassword')}
        </h1>
      </div>

      {isShowOtp ? (
        <div className=" mx-auto flex h-full w-full max-w-[540px] flex-1 items-center">
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
                  onChange={(otp) => handleOnchangeOtp(otp)}
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
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(handleActualSubmit)}
          className=" p-5"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label>{t('profile.oldPassword')}</Label>
              <div className=" relative">
                <button
                  type="button"
                  onClick={() => toggleShow(setShowOldPassword)}
                  className="absolute right-3 top-3"
                >
                  {showOldPassword ? (
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
                <Controller
                  name="currentPassword"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showOldPassword ? 'text' : 'password'}
                      className=" w-full pr-10"
                      placeholder={t('profile.enterOldPassword')}
                    />
                  )}
                />
                <span>{errors.currentPassword?.message}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t('profile.newPassword')}</Label>
              <div className=" relative">
                <button
                  type="button"
                  onClick={() => toggleShow(setShowNewPassword)}
                  className="absolute right-3 top-3"
                >
                  {showNewPassword ? (
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
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showNewPassword ? 'text' : 'password'}
                      className=" w-full pr-10"
                      placeholder={t('profile.enterNewPassword')}
                    />
                  )}
                />
                <span>{errors.newPassword?.message}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t('profile.confirmNewPassword')}</Label>
              <div className=" relative">
                <button
                  type="button"
                  onClick={() => toggleShow(setShowConfirmPassword)}
                  className="absolute right-3 top-3"
                >
                  {showConfirmPassword ? (
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
                <Controller
                  name="passwordConfirmation"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className=" w-full pr-10"
                      placeholder={t('profile.confirmNewPassword')}
                    />
                  )}
                />
                <span>{errors.passwordConfirmation?.message}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            {/* <Button type='button' onClick={() => setIsShowOtp((prev) => !prev)}>
              {t('profile.update')}
            </Button> */}
            <Button
              type="submit"
              className=""
              disabled={loading}
            >
              {loading ? '...' : t('profile.update')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
