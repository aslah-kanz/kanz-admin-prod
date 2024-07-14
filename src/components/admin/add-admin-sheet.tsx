import { useUploadImage } from '@/api/image.api';
import { useAddPrincipals, useUpdatePrincipals } from '@/api/principals.api';
import { useGetAllRole } from '@/api/role.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  Select as SelectUI,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { HTTP_STATUS } from '@/constants/common.constant';
import useAddAdminSheetStore from '@/store/add-admin-sheet.store';
import { TCountry } from '@/types/country.type';
import { TPrincipal } from '@/types/principal.type';
import { onlyNumber } from '@/utils/input.util';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { UserAdd } from 'iconsax-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FaArrowUp, FaPlus } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';
import { useQueryClient } from 'react-query';
import Select from 'react-select';
import { toast } from 'sonner';
import * as yup from 'yup';
import { capitalizeFirstLetter } from '@/utils/common.util';
import BaseCountryCodeInput from '../common/base-country-code-input';
import Pencxil from '../svg/Pencxil';

const schema = yup.object().shape({
  countrySelected: yup.mixed(),

  type: yup.string().required('required').label('Type'),
  username: yup.string().required('required').label('User Name'),
  firstName: yup.string().required('required').label('First Name'),
  lastName: yup.string().required('required').label('Last Name'),
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
    .required('required')
    .label('Phone Number'),
  countryCode: yup.number().required('required').label('Country Code'),
  email: yup
    .string()
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Invalid email format',
    )
    .required('required')
    .label('Email'),
  roles: yup
    .array()
    .when('type', (typeValue, schema) => {
      if (typeValue?.[0] === 'admin') {
        return schema.required('required').min(1, 'required');
      }
      return schema;
    })
    .label('Roles'),
  dob: yup.string().required('required').label('Date Of Birth'),
  gender: yup.string().required('required').label('Gender'),
  profilePicture: yup.string().label('Profile Pictures'),
  status: yup.string().required('required').label('Status'),
  file: yup.mixed<File>(),
});

function AddAdminSheet({ type }: { type: string | null }) {
  // const [files, setFiles] = useState<File[]>([]);

  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState('');
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { isOpen, initialValue, onChangeOpen, setInitialValue } =
    useAddAdminSheetStore();

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
    // getValues,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      type: type || '',
      username: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      countryCode: 966,
      email: '',
      roles: type === 'admin' ? [] : undefined,
      dob: '',
      status: 'disabled',
      file: undefined,
    },
  });

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop(acceptedFiles, fileRejections) {
      //   setFiles(acceptedFiles);
      // console.log('checkImages', fileRejections);
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            setImageError(`Image is too large`);
          }

          if (err.code === 'file-invalid-type') {
            setImageError(`Invalid type`);
          }
        });
      });
      const newFile = acceptedFiles[0];
      if (newFile) {
        setImage(URL.createObjectURL(newFile));
        setValue('file', newFile);
        setImageError('');
      }
    },
    noClick: true,
    multiple: false,
    maxSize: 5000000,
    accept: {
      'image/jpg': [],
      'image/png': [],
      'image/jpeg': [],
    },
  });

  const { data: roleList } = useGetAllRole({
    size: '100',
  });
  // console.log('checkRoleList', roleList?.data);
  // const FAKE_ROLE: TRole[] = [
  //   {
  //     id: 1,
  //     name: 'Admin',
  //     type: 'admin',
  //     privilageMenu: 8,
  //     status: 'active',
  //   },
  //   {
  //     id: 2,
  //     name: 'Super Admin',
  //     type: 'admin',
  //     privilageMenu: 8,
  //     status: 'active',
  //   },
  //   {
  //     id: 3,
  //     name: 'Supervisor ',
  //     type: 'admin',
  //     privilageMenu: 8,
  //     status: 'inactive',
  //   },
  // ];

  const options = roleList?.data.map((obj) => ({
    value: obj.id, // Use the original value for "value"
    label: obj.name, // Use the original value for "label"
  }));

  const onChangePrivilage = (option: any) => {
    if (option) {
      const valuesArray = option.map((obj: any) => obj.value);
      setValue('roles', valuesArray);
    }
  };

  const onChangeStatus = (isActive: boolean) => {
    if (isActive) {
      setValue('status', 'active');
      setIsChecked(true);
    } else {
      setValue('status', 'disabled');
      setIsChecked(false);
    }
  };

  const wchGender = watch('gender');

  const onSelectGender = (value: string) => {
    setValue('gender', value);
  };

  const queryClient = useQueryClient();

  const { mutateAsync: uploadImage, isLoading: loadingImage } =
    useUploadImage();
  const { mutate: addAdmin, isLoading: loading } = useAddPrincipals({
    onSuccess: (resp) => {
      // console.log('checkResp_add_admin', resp);
      if (resp.code === HTTP_STATUS.SUCCESS) {
        setImage('');
        onChangeOpen(!isOpen);
        setInitialValue(null);
        reset();
        queryClient.invalidateQueries({
          queryKey: ['getPrincipalList'],
        });
        queryClient.removeQueries({
          queryKey: ['getPrincipalList'],
        });
        toast.success(`${capitalizeFirstLetter(type || '')} Added`);
      } else {
        toast.error(resp.message);
      }
    },
  });

  const { mutate: editAdmin, isLoading: loadingUpdate } = useUpdatePrincipals({
    onSuccess: (resp) => {
      // console.log('checkResp_add_admin', resp);
      if (resp.code === HTTP_STATUS.SUCCESS) {
        setImage('');
        onChangeOpen(!isOpen);
        setInitialValue(null);
        reset();
        queryClient.invalidateQueries({
          queryKey: ['getPrincipalList'],
        });
        queryClient.removeQueries({
          queryKey: ['getPrincipalList'],
        });
        toast.success(`${capitalizeFirstLetter(type || '')} Updated`);
      } else {
        toast.error(resp.message);
      }
    },
  });

  const handleActualSubmit: SubmitHandler<TPrincipal> = useCallback(
    (values: TPrincipal) => {
      // console.log('checkValueees', errors);
      // console.log('checkValueees', values);

      if (values.file) {
        const formData = new FormData();
        formData.append('file', values.file as File);
        formData.append('name', `${Date.now()}-${values.file.name}`);
        uploadImage(formData, {
          onSuccess: (resp) => {
            if (resp.code === HTTP_STATUS.SUCCESS) {
              const payload = {
                username: values.username,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                countryCode: values.countryCode?.toString(),
                phoneNumber: values.phoneNumber,
                gender: values.gender,
                birthDate: values.dob,
                imageId: resp.data.id,
                roleIds: values.roles,
                type: type || null,
                status: values.status,
                acceeptNewsLetter: true,
              };
              if (type !== 'admin') delete payload.roleIds;
              if (initialValue) {
                if (initialValue.id) {
                  editAdmin({ id: initialValue.id, payload });
                }
              } else {
                addAdmin(payload);
              }
            } else {
              toast.error('Failed to upload image', {
                description: resp.message,
              });
            }
          },
        });
      } else {
        const payload = {
          username: values.username,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          countryCode: values.countryCode?.toString(),
          phoneNumber: values.phoneNumber,
          gender: values.gender,
          birthDate: values.dob,
          roleIds: values.roles,
          type: type || null,
          status: values.status,
          acceeptNewsLetter: true,
          imageId: null as number | null,
        };
        if (type !== 'admin') delete payload.roleIds;
        if (initialValue?.image?.id)
          payload.imageId = initialValue.image.id as number;
        if (initialValue) {
          if (initialValue.id) {
            editAdmin({
              id: initialValue.id,
              payload,
            });
          }
        } else {
          addAdmin(payload);
        }
      }

      // if (initialValue) {
      //   toast.success('Admin Updated');
      // } else {
      //   toast.success('Admin Added');
      // }
    },
    [addAdmin, editAdmin, initialValue, type, uploadImage],
  );

  useEffect(() => {
    if (initialValue) {
      setTimeout(() => {
        const initialRole = initialValue.roles?.map((obj) => obj.id);

        setValue('type', initialValue.type!);
        setValue('username', initialValue.username);
        setValue('firstName', initialValue.firstName);
        setValue('lastName', initialValue.lastName);
        setValue('phoneNumber', initialValue.phoneNumber);
        setValue('email', initialValue.email);
        setValue('status', initialValue.status!);
        setValue('profilePicture', initialValue.profilePicture!);
        setValue('gender', initialValue.gender!);
        setValue(
          'dob',
          initialValue.birthDate
            ? format(new Date(initialValue.birthDate), 'yyyy-MM-dd')
            : '',
        );
        setValue('roles', initialRole!);
        setImage(initialValue.image?.url ?? '');

        if (initialValue.status === 'active') {
          setIsChecked(true);
        } else {
          setIsChecked(false);
        }
      }, 150);
    }
  }, [initialValue, setValue]);

  const isRoleSelected = useCallback(
    (id?: number): boolean => {
      if (initialValue) {
        if (initialValue.roles) {
          return initialValue.roles.some((item) => item.id === id);
        }
        return false;
      }
      return false;
    },
    [initialValue],
  );

  React.useEffect(() => {
    if (isOpen) {
      setImage('');
    }
  }, [isOpen]);

  React.useEffect(() => {
    return () => {
      onChangeOpen(false);
      setInitialValue(null);
      queryClient.invalidateQueries('getPrincipalListById');
      queryClient.removeQueries('getPrincipalListById');
    };
  }, [onChangeOpen, queryClient, setInitialValue]);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        onChangeOpen(open);
        reset();
        setInitialValue(null);
      }}
    >
      <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
        <SheetHeader
          className=" sticky top-0 gap-2 bg-white pt-4"
          style={{ zIndex: 1 }}
        >
          <div className="flex items-center justify-between">
            <SheetTitle>
              <div className="flex items-center gap-2">
                <UserAdd size={24} />
                {initialValue
                  ? `Edit ${capitalizeFirstLetter(type || '')}`
                  : `Add ${capitalizeFirstLetter(type || '')}`}
              </div>
            </SheetTitle>
            <SheetClose>
              <FiX />
            </SheetClose>
          </div>
          <hr />
        </SheetHeader>
        <form onSubmit={handleSubmit(handleActualSubmit)}>
          {/* begin: main drawer */}
          <div className=" flex flex-col gap-4">
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Username</Label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Input Username"
                  />
                )}
              />
              <span className="font-small text-sm text-red-600">
                {errors.username?.message}
              </span>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">First Name</Label>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Input First Name"
                  />
                )}
              />
              <span className="font-small text-sm text-red-600">
                {errors.firstName?.message}
              </span>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Last Name</Label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Input Last Name"
                  />
                )}
              />
              <span className="font-small text-sm text-red-600">
                {errors.lastName?.message}
              </span>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Date of Birth</Label>
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    className="datepicker"
                  />
                )}
              />
              <span className="font-small text-sm text-red-600">
                {errors.dob?.message}
              </span>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Gender</Label>
              <SelectUI
                onValueChange={(value) => onSelectGender(value)}
                // defaultValue={wchGender}
                value={wchGender}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose your gender here" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </SelectUI>
              <span className="font-small text-sm text-red-600">
                {errors.gender?.message}
              </span>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Phone Number</Label>
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
                          placeholder="Enter your phone number"
                          {...onlyNumber(fieldPhoneNumber)}
                        />
                      )}
                    />
                  </BaseCountryCodeInput>
                )}
              />
              <span className="font-small text-sm text-red-600">
                {errors.phoneNumber?.message}
              </span>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Input Email"
                  />
                )}
              />
              <span className="font-small text-sm text-red-600">
                {errors.email?.message}
              </span>
            </div>
            {type === 'admin' && (
              <div className=" relative flex w-full flex-col gap-2">
                <Label className=" text-sm">Role</Label>
                <Select
                  options={options}
                  isMulti
                  defaultValue={options?.filter((value) =>
                    isRoleSelected(value.value),
                  )}
                  className="basic-multi-select text-sm"
                  classNamePrefix="select"
                  isClearable={false}
                  styles={{
                    valueContainer: (base) => ({
                      ...base,
                      overflowY: 'auto',
                    }),
                  }}
                  onChange={onChangePrivilage}
                />
                <span className="font-small text-sm text-red-600">
                  {errors.roles?.message}
                </span>
              </div>
            )}
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Avatar</Label>
              {image ? (
                <div
                  {...getRootProps({
                    className:
                      ' group relative mx-auto aspect-[2/0.8] w-full overflow-hidden rounded-lg border',
                  })}
                >
                  <Image
                    src={image}
                    fill
                    alt=""
                    className="object-contain"
                  />
                  <div className=" absolute inset-0 flex h-full w-full items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <input {...getInputProps()} />
                      <Button
                        size="icon-sm"
                        className=" border border-white fill-white hover:bg-white hover:fill-neutral-950"
                        variant="transparent"
                        onClick={open}
                        type="button"
                      >
                        <Pencxil />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  {...getRootProps({
                    className:
                      'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6',
                  })}
                >
                  <input {...getInputProps()} />
                  <div className="flex w-full flex-col gap-2 text-center">
                    <div className=" relative aspect-square h-14">
                      <Image
                        src="/images/file-upload.svg"
                        fill
                        alt=""
                        className=" object-contain object-center"
                      />
                    </div>
                    <p className=" text-sm text-neutral-500">
                      Drag or Upload Image
                    </p>
                  </div>
                  <div className=" mt-4">
                    <Button
                      onClick={open}
                      type="button"
                      variant="ghost-primary"
                      size="sm"
                    >
                      <FaArrowUp size={12} />
                      Upload
                    </Button>
                  </div>
                </div>
              )}
              <span className="font-small text-sm text-red-600">
                {imageError}
              </span>
              <span className="font-small text-sm text-red-600">
                {errors.file?.message}
              </span>
            </div>
            <div className=" mb-4 flex flex-col gap-2">
              <Label className=" text-sm">Status</Label>
              <Switch
                checked={isChecked}
                onCheckedChange={(e) => onChangeStatus(e)}
              />
            </div>
          </div>
          {/* end: main drawer */}
          <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
            <Button
              type="submit"
              disabled={loading || loadingImage || loadingUpdate}
              // onClick={() => {
              //   onChangeOpen(!isOpen);
              // }}
            >
              <FaPlus />
              Save
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default AddAdminSheet;
