'use client';

import { useAuthResetPassword } from '@/api/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/locales/client';
import { TAuthResetPassword } from '@/types/auth.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeSlash } from 'iconsax-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import OtpInput from 'react-otp-input';
import * as yup from 'yup';

const schema = yup.object().shape({
  token: yup.string().required('required'),
  password: yup
    .string()
    .required('required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Your password must be more than six characters and include a combination of numbers, letters and special characters',
    )
    .label('Password'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('required')
    .label('Confirm Password'),
});

export default function ForgotPasswordPage() {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);
  const t = useI18n();

  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setIsShowConfirmPassword((prev) => !prev);
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      token: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isShowOtp, setIsShowOtp] = useState<boolean>(false);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    setValue('token', decodeURIComponent(searchParams.get('token') as string));
  }, [searchParams, setValue]);

  const { mutate: _mutate, isLoading: _loading } = useAuthResetPassword({
    onSuccess(resp) {
      console.log('resetPassword', resp);
    },
  });

  const handleActualSubmit = useCallback((_values: TAuthResetPassword) => {
    // mutate(values);
    setIsShowOtp((prev) => !prev);
  }, []);

  const handleOnchange = (value: string) => {
    setOtp(value);
    console.log('checkOtp', value.length);
    if (value.length === 6) {
      router.replace('/login');
    }
  };

  return (
    <div className=" h-full w-96">
      {isShowOtp ? (
        <div className=" mx-auto w-full max-w-[540px]">
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
                <OtpInput
                  value={otp}
                  onChange={(value) => handleOnchange(value)}
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
          className=" mx-auto w-full max-w-md"
        >
          <div className=" flex flex-col gap-3 text-center">
            <h1 className=" text-2xl font-medium text-neutral-800">
              {t('auth.resetPassword.title')}
            </h1>
            {/* <p className=" text-base text-neutral-500">
              Enter your email, and we will send you a link to return to your
              account.
            </p> */}
          </div>
          <div className="mt-8 flex flex-col gap-6">
            <div className=" flex flex-col gap-2">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                {t('common.newPassword')}
              </label>
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
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={isShowPassword ? 'text' : 'password'}
                      className=" w-full pr-10"
                      placeholder={t('common.newPasswordPlacehorder')}
                    />
                  )}
                />
                <span>{errors?.password?.message}</span>
              </div>
            </div>
            <div className=" flex flex-col gap-2">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                {t('common.confirmNewPassword')}
              </label>
              <div className=" relative">
                <button
                  onClick={toggleShowConfirmPassword}
                  className="absolute right-3 top-3"
                >
                  {isShowConfirmPassword ? (
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
                      type={isShowConfirmPassword ? 'text' : 'password'}
                      className=" w-full pr-10"
                      placeholder={t('common.confirmNewPasswordPlaceholder')}
                    />
                  )}
                />
                <span>{errors?.passwordConfirmation?.message}</span>
              </div>
            </div>
          </div>
          <div className=" my-8">
            <Button
              type="submit"
              className=" w-full"
            >
              {t('auth.resetPassword.title')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
