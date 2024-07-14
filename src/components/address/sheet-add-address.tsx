import { useAddAddress, useUpdateAddress } from '@/api/address.api';
import BaseCountryCodeInput from '@/components/common/base-country-code-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { HTTP_STATUS } from '@/constants/common.constant';
import useModalAddAddressStore from '@/store/modal-add-address.store';
import useProfileStore from '@/store/profile/profile.store';
import { TShippingAddress } from '@/types/address.type';
import { TCountry } from '@/types/country.type';
import { onlyNumber } from '@/utils/input.util';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
} from '@vis.gl/react-google-maps';
import { Location } from 'iconsax-react';
import { useCallback, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import * as yup from 'yup';

const schema = yup.object().shape({
  countrySelected: yup.mixed(),

  recipientName: yup.string().required('required'),
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
  name: yup.string().required('required'),
  address: yup.string().required('required'),
  country: yup.string().required('required'),
  city: yup.string().required('required'),
  latitude: yup.string().required('Please, select your location first'),
  longitude: yup.string().required('Please, select your location first'),
  defaultAddress: yup.bool().optional(),
});

function SheetAddAddress() {
  const [latLang, setLatLang] = useState<
    google.maps.LatLng | google.maps.LatLngLiteral | null
  >(null);
  const [textLatLng, setTextLatLng] = useState('');
  const { isOpen, initialValue, onChangeOpen } = useModalAddAddressStore();
  const { profile } = useProfileStore();
  const profileName = `${profile?.firstName} ${profile?.lastName}`;

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      recipientName: profileName,
      phoneNumber: '',
      countryCode: 966,
      address: '',
      country: '',
      city: '',
      latitude: '',
      longitude: '',
      defaultAddress: false,
    },
  });

  useEffect(() => {
    if (latLang) {
      setValue('latitude', latLang.lat.toString());
      setValue('longitude', latLang.lng.toString());
      const newLatLng = `${latLang.lat}, ${latLang.lng}`;
      setTextLatLng(newLatLng);
    }
  }, [latLang, setValue]);

  useEffect(() => {
    if (initialValue) {
      setValue('name', initialValue.name);
      setValue('recipientName', initialValue.recipientName);
      setValue('phoneNumber', initialValue.phoneNumber);
      setValue('address', initialValue.address);
      setValue('country', initialValue.country);
      setValue('city', initialValue.city);
      setValue('latitude', initialValue.latitude);
      setValue('longitude', initialValue.longitude);
      setValue('defaultAddress', initialValue.defaultAddress);
      setValue('countryCode', Number(initialValue.countryCode));
      const newLatLng = `${initialValue.latitude}, ${initialValue.longitude}`;
      setTextLatLng(newLatLng);
    }
  }, [initialValue, setValue]);

  const queryClient = useQueryClient();

  const { mutate, isLoading: loading } = useAddAddress({
    onSuccess(resp) {
      // console.log('checkResp', resp);
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Address successfully added');
        reset();
        onChangeOpen(!isOpen);
        queryClient.invalidateQueries({
          queryKey: ['getShippingAddresses'],
        });
      } else {
        toast.error(resp.message);
      }
    },
  });

  const { mutate: mutateUpdate, isLoading: loadingUpdate } = useUpdateAddress({
    onSuccess(resp) {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Address successfully updated');
        reset();
        onChangeOpen(!isOpen);
        queryClient.invalidateQueries({
          queryKey: ['getShippingAddresses'],
        });
      } else {
        toast.error(resp.message);
      }
    },
  });

  const handleActualSubmit: SubmitHandler<TShippingAddress> = useCallback(
    (values: TShippingAddress) => {
      if (initialValue) {
        mutateUpdate({
          id: initialValue.id as number,
          payload: {
            ...values,
            countryCode: values.countryCode.toString(),
            phoneNumber: values.phoneNumber.replace(
              /[\u{0080}-\u{10FFFF}]/gu,
              '',
            ),
          },
        });
      } else {
        mutate({
          ...values,
          countryCode: values.countryCode.toString(),
          phoneNumber: values.phoneNumber.replace(
            /[\u{0080}-\u{10FFFF}]/gu,
            '',
          ),
        });
      }
    },
    [initialValue, mutate, mutateUpdate],
  );

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => onChangeOpen(open)}
    >
      <SheetContent className=" flex flex-col overflow-y-auto bg-white p-4 py-0">
        <SheetHeader className=" sticky top-0 z-[10] bg-white pb-2 pt-4">
          <div className="flex items-center justify-between bg-white">
            <SheetTitle>
              {initialValue ? 'Edit Address' : 'Add Address'}
            </SheetTitle>
            <SheetClose>
              <FiX />
            </SheetClose>
          </div>
          <hr />
        </SheetHeader>

        <div className=" z-[1] flex flex-1 flex-col gap-2">
          {/* begin: main form */}
          <form onSubmit={handleSubmit(handleActualSubmit)}>
            <div className=" mb-4 flex flex-col gap-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Label Address
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your label address"
                  />
                )}
              />
              <span>{errors.name?.message}</span>
            </div>
            <div className=" mb-4 flex flex-col gap-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Phone Number
              </label>
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
              <span>{errors.phoneNumber?.message}</span>
            </div>
            <div className="relative">
              <div id="map-location">
                <APIProvider
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
                >
                  <Map
                    mapId="map-location"
                    defaultZoom={10}
                    defaultCenter={{ lat: 24.774265, lng: 46.738586 }}
                    gestureHandling="greedy"
                    disableDefaultUI
                    className=" z-[52] aspect-[2/1] w-full"
                    onClick={(e) => {
                      setLatLang(e.detail.latLng);
                    }}
                  >
                    <AdvancedMarker
                      position={
                        initialValue
                          ? {
                              lat: Number(initialValue.latitude),
                              lng: Number(initialValue.longitude),
                            }
                          : latLang
                      }
                      onDragEnd={(e) => setLatLang(e.latLng)}
                      draggable
                    >
                      <Pin />
                    </AdvancedMarker>
                  </Map>
                </APIProvider>
              </div>
            </div>
            <div className=" flex flex-col gap-1">
              <div className="relative">
                <Location className=" absolute left-2 top-2 text-primary" />
                <Input
                  value={textLatLng}
                  readOnly
                  className=" pl-10"
                  placeholder="Location"
                />
              </div>
            </div>
            <div className=" my-4 flex flex-col gap-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Country
              </label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your Country"
                  />
                )}
              />
              <span>{errors.country?.message}</span>
            </div>
            <div className=" mb-4 flex flex-col gap-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                City
              </label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your Country"
                  />
                )}
              />
              <span>{errors.city?.message}</span>
            </div>
            <div className=" mb-4 flex flex-col gap-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Address Detail
              </label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your detail address"
                  />
                )}
              />
              <span>{errors.address?.message}</span>
            </div>
            <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
              <Button
                type="submit"
                disabled={loading || loadingUpdate}
              >
                {loading || loadingUpdate ? '...' : 'Add Address'}
              </Button>
            </div>
          </form>
          {/* end: main form */}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SheetAddAddress;
