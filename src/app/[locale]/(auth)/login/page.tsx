'use client';

import { useAuthLogin } from '@/api/auth.api';
import DialogOtpLogin from '@/components/dialog/dialog-otp-login';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HTTP_STATUS } from '@/constants/common.constant';
import { useI18n } from '@/locales/client';
import useDialogOtpLoginStore from '@/store/dialog-otp-login';
import { TAuthLogin } from '@/types/auth.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeSlash } from 'iconsax-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

const schema = yup.object().shape({
  username: yup.string().required('This field is required'),
  password: yup.string().required('This field is required'),
  types: yup.array(yup.string().required()).required(),
});

export default function LoginPage() {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };
  const t = useI18n();

  const { isOpen, onOpen } = useDialogOtpLoginStore();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
      types: ['admin'],
    },
  });

  // const { setCredential } = useAuthStore();
  // const router = useRouter();

  const allowedType = ['admin'];

  const { mutate: save, isLoading: loading } = useAuthLogin({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        if (
          resp.data.principal?.type &&
          allowedType.indexOf(resp.data.principal?.type) > -1
        ) {
          // eslint-disable-next-line no-console, no-constant-condition
          if (process.env.NEXT_PUBLIC_DEV_MODE === 'true' || true) {
            console.log('checkLogin', resp.data);
          }
          onOpen(resp.data);
        } else {
          toast.error('Invalid Username or Password');
        }
        // setCredential(resp.data);
        // openOtp();
        // setLoadProfile(true)
        // toast.success('Login Success');
        // router.replace('/');
        // router.refresh();
      } else {
        toast.error(resp.message);
      }
    },
  });

  const handleActualSubmit = useCallback(
    (values: TAuthLogin) => {
      save(values);
    },
    [save],
  );

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      inputFileRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div className="">
      <div className=" mx-auto w-full max-w-md">
        <form onSubmit={handleSubmit(handleActualSubmit)}>
          <div className=" flex w-full flex-col gap-3 text-center">
            <h1 className=" text-2xl font-medium text-neutral-800">
              {t('auth.login.title')}
            </h1>
            <p className=" text-base text-neutral-500">
              {t('auth.login.subtitle')}
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-6">
            <div className=" space-y-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                {t('common.username')}
              </label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    ref={inputFileRef}
                    className=" w-full"
                    autoFocus
                    placeholder="Enter your username"
                  />
                )}
              />
              <span className="font-small text-xs text-red-600">
                {errors?.username?.message}
              </span>
            </div>
            <div className=" flex flex-col gap-2">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                {t('common.password')}
              </label>
              <div className=" relative">
                <button
                  type="button"
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
                      placeholder="Enter your password"
                    />
                  )}
                />
                <span className="font-small text-xs text-red-600">
                  {errors?.password?.message}
                </span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    className=" accent-primary"
                  />
                  <label
                    htmlFor=""
                    className=" text-xs text-neutral-800"
                  >
                    {t('auth.login.rememberMe')}
                  </label>
                </div>

                <Link
                  href="/forgot-password"
                  className=" text-xs text-primary"
                >
                  {t('auth.login.forgotPassword')}
                </Link>
              </div>
            </div>
          </div>
          <div className=" my-8">
            <Button
              className=" btn-blinking w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? '...' : t('auth.login.loginButton')}
            </Button>
          </div>
          {/* <p className=" text-center text-sm font-medium text-neutral-800">
          Don&apos;t have an account?{' '}
          <Link
            className=" text-primary"
            href="/register"
          >
            Sign Up
          </Link>
        </p> */}
        </form>
      </div>
      <DialogOtpLogin />
    </div>
  );
}
