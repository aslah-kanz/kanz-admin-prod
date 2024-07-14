'use client';

import { useAuthForgotPassword } from '@/api/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/locales/client';
import { TAuthForgotPassword } from '@/types/auth.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup
    .string()
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Email must be a valid email',
    )
    .required('This field is required')
    .label('Email'),
});

export default function ResetPasswordPage() {
  const [isSent, setIsSent] = useState<boolean>(false);
  const t = useI18n();

  const {
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const { mutate: send, isLoading: _loading } = useAuthForgotPassword({
    onSuccess: (_resp) => {
      // console.log('forgotPassword', resp);
      toast.message('Email Send');
    },
  });

  const router = useRouter();
  const handleActualSubmit = useCallback(
    (values: TAuthForgotPassword) => {
      send(values);
      setIsSent((prev) => !prev);
      // setTimeout(() => {
      //   router.push(`/reset-password?token=INI_TOKEN`);
      // }, 3000);
    },
    [send],
  );

  return (
    <div className=" h-full">
      {isSent ? (
        <div className=" mx-auto w-full max-w-[540px]">
          <div className="flex flex-col gap-8">
            <button
              onClick={() => router.back()}
              style={{ cursor: 'pointer' }}
            >
              <ArrowLeft size="20" />
            </button>
            <div className=" flex flex-col gap-3 text-center">
              <h1 className=" text-2xl font-medium text-neutral-800">
                {t('auth.forgotPassword.emailSend')}
              </h1>
              <p className=" text-base text-neutral-500">
                {t('auth.forgotPassword.emailDispatched')}
                <span className=" font-medium text-primary">
                  {getValues('email')}
                </span>
              </p>
            </div>
            <p className=" text-center text-neutral-500">
              {t('auth.forgotPassword.warning')}
            </p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(handleActualSubmit)}
          className=" mx-auto w-full max-w-md"
        >
          <button
            onClick={() => router.back()}
            style={{ cursor: 'pointer' }}
          >
            <ArrowLeft size="20" />
          </button>
          <div className=" flex flex-col gap-3 text-center">
            <h1 className=" text-2xl font-medium text-neutral-800">
              {t('auth.forgotPassword.title')}
            </h1>
            <p className=" text-base text-neutral-500">
              {t('auth.forgotPassword.subTitle')}
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-6">
            <div className=" space-y-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                {t('common.email')}
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className=" w-full"
                    placeholder="ex: kanzway@example.com"
                  />
                )}
              />
              <span className="font-small text-xs text-red-600">
                {errors?.email?.message}
              </span>
            </div>
          </div>
          <div className=" my-8">
            <Button
              type="submit"
              className=" w-full"
            >
              {t('auth.forgotPassword.sendLoginLink')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
