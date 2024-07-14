'use client';

import { useGetProfile, useUpdateProfile } from '@/api/profile.api';
import BaseCountryCodeInput from '@/components/common/base-country-code-input';
import DialogOtp from '@/components/dialog/dialog-otp';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HTTP_STATUS } from '@/constants/common.constant';
import { useI18n } from '@/locales/client';
import useDialogOtpStore from '@/store/dialog-otp.store';
import useProfileStore from '@/store/profile/profile.store';
import { TCountry } from '@/types/country.type';
import { TCustomerProfile } from '@/types/profile.type';
import { onlyNumber } from '@/utils/input.util';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { Eye, EyeSlash, Warning2 } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import * as yup from 'yup';

const SUPPORTED_FORMATS = ['image/jpg', 'image/png', 'image/jpeg'];

const schema = yup.object().shape({
  // Handling for phone number validation
  countrySelected: yup.mixed(),

  file: yup
    .mixed<File>()
    .test('fileFormat', 'Unsupported Format', (value) =>
      value ? SUPPORTED_FORMATS.includes(value.type) : true,
    ),
  type: yup.string().required('This field is required').label('Type'),
  firstName: yup
    .string()
    .required('This field is required')
    .label('First Name'),
  lastName: yup.string().required('This field is required').label('Last Name'),
  username: yup.string().required('This field is required').label('Username'),
  email: yup.string().email().required('This field is required').label('Email'),
  phoneNumber: yup
    .string()
    .test({
      name: 'phone-number-validation',
      test(value, context) {
        if (!value) {
          return this.createError({
            path: 'required',
          });
        }

        const selected = context.parent.countrySelected as TCountry;

        if (!selected) {
          return this.createError({
            message: `Please select a country`,
          });
        }

        if (!value.startsWith(selected.phoneStartNumber.toString())) {
          // Check Prefix
          return this.createError({
            message: `The first digits must be ${selected.phoneStartNumber}`,
          });
        }

        // Check max length
        if (value.length > selected.phoneMaxLength) {
          return this.createError({
            message: `Cannot be more than ${selected.phoneMaxLength} digits`,
          });
        }

        // Check min length
        if (value.length < selected.phoneMinLength) {
          return this.createError({
            message: `Cannot be less than ${selected.phoneMinLength} digits`,
          });
        }

        return true;
      },
    })
    .required('This field is required')
    .label('Phone Number'),
  countryCode: yup
    .number()
    .required('This field is required')
    .label('Country Code'),
  birthDate: yup
    .string()
    .required('This field is required')
    .label('Birth Date'),
  gender: yup.string().required('This field is required').label('Gender'),
});

export default function ProfilePage() {
  const [loadProfile, setLoadProfile] = useState<boolean>(false);
  const [isShowDeleteStore, setIsShowDeleteStore] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [step, setStep] = useState<'password' | 'phone_number'>('password');
  const [image, setImage] = useState('https://picsum.photos/200/300');

  const { onOpen: onOpenDialogOtp, isValidated } = useDialogOtpStore();
  // const { profile } = useProfileStore();

  const { add: addProfile } = useProfileStore();
  const { data: profile } = useGetProfile({
    enabled: loadProfile,
    onSuccess(resp) {
      addProfile(resp);
    },
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isLoading: loading } = useUpdateProfile({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        setLoadProfile(true);
        toast.success('Profile Updated');
        queryClient.invalidateQueries({
          queryKey: ['getDetailProfile'],
        });
        queryClient.removeQueries({
          queryKey: ['getDetailProfile'],
        });
        router.push('/profile');
        router.refresh();
      } else {
        toast.error(resp.message);
      }
    },
  });

  const t = useI18n();

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    // reset,
    // resetField,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'admin',
      countryCode: 966,
      username: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      birthDate: '',
      gender: '',
      file: undefined,
    },
  });

  useEffect(() => {
    if (profile) {
      setTimeout(() => {
        // console.log('checkProfile', profile);
        setValue('type', 'admin');
        setValue('countryCode', parseInt(profile?.countryCode as string, 10));
        setValue('username', profile.username);
        setValue('firstName', profile.firstName);
        setValue('lastName', profile.lastName);
        setValue('phoneNumber', profile.phoneNumber);
        setValue('email', profile.email);
        setValue(
          'birthDate',
          format(new Date(profile?.birthDate), 'yyyy-MM-dd'),
        );
        setValue('gender', profile.gender);

        setImage(profile.image?.url ?? 'https://picsum.photos/200/300');
      }, 150);
    }
  }, [profile, setValue]);

  const wchGender = watch('gender');

  const toggleShowDeleteStore = () => {
    setIsShowDeleteStore((prev) => !prev);
  };

  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  const onSelectGender = (value: string) => {
    setValue('gender', value);
  };

  const handleActualSubmit: SubmitHandler<TCustomerProfile> = useCallback(
    (values: TCustomerProfile) => {
      // console.log('checkValueees', values)
      const newPhoneNumber = values.phoneNumber.replace(
        /[\u{0080}-\u{10FFFF}]/gu,
        '',
      );
      const fd = new FormData();
      fd.append('firstName', values.firstName);
      fd.append('lastName', values.lastName);
      fd.append('email', values.email);
      fd.append('countryCode', values.countryCode.toString());
      fd.append('phoneNumber', newPhoneNumber);
      fd.append('gender', values.gender.toLowerCase());
      fd.append('birthDate', format(new Date(values.birthDate), 'MM/dd/yyyy'));
      fd.append('file', values.file as File);

      mutate(fd);
    },
    [mutate],
  );

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleTriggerFileChange = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const inputSubmitRef = useRef<HTMLButtonElement | null>(null);

  const handleTriggerSubmit = () => {
    if (inputSubmitRef.current) {
      inputSubmitRef.current.click();
    }
  };

  useEffect(() => {
    if (isValidated) {
      handleTriggerSubmit();
    }
  }, [isValidated]);

  // console.log('checkError', errors);

  return (
    <>
      <div className=" w-full rounded-lg border">
        <div className=" w-full border-b p-5">
          <h1 className=" text-lg font-medium text-neutral-800">
            {t('profile.editProfile')}
          </h1>
        </div>

        {/* begin: form */}
        <form
          onSubmit={handleSubmit(handleActualSubmit)}
          className=" p-5"
        >
          <div className=" col-span-4 mb-3">
            <Label>{t('profile.profilePicture')}</Label>
          </div>
          <div className="align-items-center flex-sm-wrap mb-4 flex gap-4">
            <div className="profile-thumb">
              <Image
                src={image}
                width={108}
                height={108}
                className="img-fluid"
                alt=""
              />
            </div>
            <div className="profile-upload-button">
              <div className="upload-file-btn">
                <input
                  ref={inputFileRef}
                  type="file"
                  className="hidden"
                  id="upload-thumb"
                  accept=".jpg,.png"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (SUPPORTED_FORMATS.includes(file.type)) {
                        if (file.size < 2097152) {
                          setValue('file', file);
                          setImage(URL.createObjectURL(file));
                        } else {
                          toast.error('File too big');
                        }
                      } else {
                        toast.error('Unsupported Format');
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleTriggerFileChange}
                >
                  {t('profile.chooseFile')}
                </Button>
              </div>
              <div className="text-xxs">{t('profile.maxSize')}</div>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-12">
              <div className=" col-span-4">
                <Label>
                  {t('profile.fullName')}{' '}
                  <span className=" text-primary">*</span>
                </Label>
              </div>
              <div className=" col-span-8 grid grid-cols-2 gap-6">
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className=" bg-neutral-200/50"
                    />
                  )}
                />

                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className=" bg-neutral-200/50"
                    />
                  )}
                />
                <span className="font-small text-xs text-red-600">
                  {errors.firstName?.message}
                </span>
                <span className="font-small text-xs text-red-600">
                  {errors.lastName?.message}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className=" col-span-4">
                <Label>
                  {t('profile.username')}{' '}
                  <span className=" text-primary">*</span>
                </Label>
              </div>
              <div className=" col-span-8 ">
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      readOnly
                      className="bg-neutral-200/50 text-gray-600"
                    />
                  )}
                />
                <span className="font-small text-xs text-red-600">
                  {errors.username?.message}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className=" col-span-4">
                <Label>
                  {t('profile.email')} <span className=" text-primary">*</span>
                </Label>
              </div>
              <div className=" col-span-8 ">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className=" bg-neutral-200/50"
                    />
                  )}
                />
                <span className="font-small text-xs text-red-600">
                  {errors.email?.message}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className=" col-span-4">
                <Label>
                  {t('profile.contactPhone')}{' '}
                  <span className=" text-primary">*</span>
                </Label>
              </div>
              <div className=" col-span-8 ">
                <Controller
                  name="countryCode"
                  control={control}
                  render={({ field }) => (
                    <BaseCountryCodeInput
                      {...field}
                      onChange={(val, country) => {
                        field.onChange(val);
                        setValue('countrySelected', country);
                      }}
                    >
                      <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field: fieldPhoneNumber }) => (
                          <Input
                            {...fieldPhoneNumber}
                            className=" bg-neutral-200/50"
                            {...onlyNumber(fieldPhoneNumber)}
                          />
                        )}
                      />
                    </BaseCountryCodeInput>
                  )}
                />
                <span className="font-small text-xs text-red-600">
                  {errors.phoneNumber?.message}
                </span>
                <span className="font-small text-xs text-red-600">
                  {errors.countryCode?.message}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className=" col-span-4">
                <Label>
                  {t('profile.birthDate')}{' '}
                  <span className=" text-primary">*</span>
                </Label>
              </div>
              <div className="col-span-8">
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      className="datepicker bg-neutral-200/50"
                    />
                  )}
                />
                <span className="font-small text-xs text-red-600">
                  {errors.birthDate?.message}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className=" col-span-4">
                <Label>
                  {t('profile.gender')} <span className=" text-primary">*</span>
                </Label>
              </div>
              <div className="col-span-8">
                <Select
                  onValueChange={(value) => onSelectGender(value)}
                  // defaultValue={wchGender}
                  value={wchGender}
                >
                  <SelectTrigger className="bg-neutral-200/50">
                    <SelectValue placeholder="Choose your gender here" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">{t('profile.male')}</SelectItem>
                    <SelectItem value="Female">
                      {t('profile.female')}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <span className="font-small text-xs text-red-600">
                  {errors.gender?.message}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            {/* <Button type='button' onClick={toggleShowDeleteStore} disabled={loading}>{loading ? '...' : 'Save Changes'}</Button> */}
            <Button
              type="submit"
              className=""
              disabled={loading}
            >
              {loading ? '...' : 'Save Changes'}
            </Button>
          </div>
        </form>
        {/* end: form */}
      </div>

      <DialogOtp />

      {/* begin: dialog edit profile */}
      <Dialog
        open={isShowDeleteStore}
        onOpenChange={toggleShowDeleteStore}
      >
        <DialogContent className=" max-w-md p-10">
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
                  To verify and proceed with edit profile, please enter your
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
                  To verify and proceed with edit profile, please enter your
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
                    setStep('password');
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
      {/* end: dialog edit profile */}
    </>
  );
}
