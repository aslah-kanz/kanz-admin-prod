'use client';

import { useGetCountries } from '@/api/country.api';
import { useAddPrincipals, useUpdatePrincipals } from '@/api/principals.api';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { Switch } from '@/components/ui/switch';
import { TCountry } from '@/types/country.type';
import { TPrincipal } from '@/types/principal.type';
import { getLang } from '@/utils/locale.util';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FaChevronRight } from 'react-icons/fa6';
import { toast } from 'sonner';
import * as yup from 'yup';

const SUPPORTED_FORMATS = ['application/pdf'];

const schema = yup.object().shape({
  username: yup.string().required('required').label('Username'),
  firstName: yup.string().required('required').label('First Name'),
  lastName: yup.string().required('required').label('Last Name'),
  phoneNumber: yup
    .string()
    .required('required')
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      'Phone number is not valid',
    )
    .label('Phone Number'),
  email: yup
    .string()
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Invalid email format',
    )
    .required('required')
    .label('Email'),
  note: yup.string().required('required').label('Note'),
  bcid: yup.string().required('required').label('BCID'),
  dob: yup.string().required('required').label('Date Of Birth'),
  gender: yup.string().required('required').label('Gender'),
  type: yup.string().required('required').label('Type'),

  country: yup.string().required('required').label('Country'),
  city: yup.string().required('required').label('City'),

  companyNumber: yup
    .string()
    .required('required')
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      'Phone number is not valid',
    )
    .label('Company Number'),
  companyNameEn: yup.string().required('required').label('Company Name EN'),
  companyNameAr: yup.string().required('required').label('Company Name AR'),

  crNumber: yup.string().required('required').label('Comercial Reg Number'),
  crNationalUnifiedNumber: yup
    .string()
    .required('required')
    .label('National Unified Number'),
  crCompanyTradeNameEn: yup
    .string()
    .required('required')
    .label('Company Trade Name EN'),
  crCompanyTradeNameAr: yup
    .string()
    .required('required')
    .label('Company Trade Name AR'),
  crCompanyType: yup.string().required('required').label('Comercial Reg Type'),
  crCompanyAddress: yup
    .string()
    .required('required')
    .label('Comercial Reg Address'),
  crCompanyLat: yup
    .string()
    .required('required')
    .label('Comercial Reg Latitude'),
  crCompanyLng: yup
    .string()
    .required('required')
    .label('Comercial Reg Longitude'),
  crDocument: yup.string().label('Comercial Reg Document'),
  crDocumentFile: yup
    .mixed<File>()
    .required('required')
    .test(
      'fileFormat',
      'Unsupported Format',
      (value) => value && SUPPORTED_FORMATS.includes(value.type),
    ),
  crDocumentIssueDate: yup
    .string()
    .required('required')
    .label('Comercial Reg Document Issue Date'),
  crDocumentExpireDate: yup
    .string()
    .required('required')
    .label('Comercial Reg Document Expire Date'),
  crCompanyActivities: yup
    .string()
    .required('required')
    .label('Comercial Reg Company Activities'),

  vatType: yup.string().required('required').label('VAT Type'),
  vatTaxRegistrationNumber: yup
    .string()
    .required('required')
    .label('Tax registration Number'),
  vatTaxRegistrationCertificate: yup
    .string()
    .label('Tax registration Certificate'),
  vatTaxRegistrationCertificateFile: yup
    .mixed<File>()
    .required('required')
    .test(
      'fileFormat',
      'Unsupported Format',
      (value) => value && SUPPORTED_FORMATS.includes(value.type),
    ),
  vatTaxRegistrationIssuingDate: yup
    .string()
    .required('required')
    .label('Tax registration Issuing Date'),
  vatTaxRegistrationExpireDate: yup
    .string()
    .required('required')
    .label('Tax registration Expire Date'),

  apFirstName: yup
    .string()
    .required('required')
    .label('Authorized Person First Name'),
  apLastName: yup
    .string()
    .required('required')
    .label('Authorized Person Last Name'),
  apPhoneNumber: yup
    .string()
    .required('required')
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      'Phone number is not valid',
    )
    .label('Authorized Person Phone Number'),
  apEmail: yup
    .string()
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Invalid email format',
    )
    .required('required')
    .label('Authorized Person Email'),
  apID: yup.string().label('Authorized Person ID'),
  apIDFile: yup
    .mixed<File>()
    .required('required')
    .test(
      'fileFormat',
      'Unsupported Format',
      (value) => value && SUPPORTED_FORMATS.includes(value.type),
    ),
  apPowerOfAttorney: yup.string().label('Authorized Person Power of Attorney'),
  apPowerOfAttorneyFile: yup
    .mixed<File>()
    .required('required')
    .test(
      'fileFormat',
      'Unsupported Format',
      (value) => value && SUPPORTED_FORMATS.includes(value.type),
    ),
  apIsMentioned: yup.boolean(),

  bankIban: yup.string().required('required').label('Bank IBAN'),
  bankName: yup.string().required('required').label('Bank Name'),
  bankCity: yup.string().required('required').label('Bank City'),
  bankBeneficiaryName: yup
    .string()
    .required('required')
    .label('Bank Beneficiary Name'),
  bankProofDocument: yup.string().label('Bank Beneficiary Name'),
  bankProofDocumentFile: yup
    .mixed<File>()
    .required('required')
    .test(
      'fileFormat',
      'Unsupported Format',
      (value) => value && SUPPORTED_FORMATS.includes(value.type),
    ),
});

export default function AddVendorPage() {
  const params = useParams();
  const [_selectedCountry, setSelectedCountry] =
    useState<Partial<TCountry> | null>();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { data: country } = useGetCountries();

  const router = useRouter();
  // const queryClient = useQueryClient();

  const { mutate: _addVendor, isLoading: _loadingAddVendor } =
    useAddPrincipals();
  const { mutate: _updateVendor, isLoading: _loadingUpdateVendor } =
    useUpdatePrincipals();

  const {
    handleSubmit,
    formState: { errors },
    control,
    // reset,
    setValue,
    watch,
    // getValues,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      note: '',
      bcid: '',
      dob: '',
      gender: '',
      type: '',

      country: '',
      city: '',

      companyNumber: '',
      companyNameEn: '',
      companyNameAr: '',

      crNumber: '',
      crNationalUnifiedNumber: '',
      crCompanyTradeNameEn: '',
      crCompanyTradeNameAr: '',
      crCompanyType: '',
      crCompanyAddress: '',
      crCompanyLat: '',
      crCompanyLng: '',
      crDocument: '',
      crDocumentFile: undefined,
      crDocumentIssueDate: '',
      crDocumentExpireDate: '',
      crCompanyActivities: '',

      vatType: '',
      vatTaxRegistrationNumber: '',
      vatTaxRegistrationCertificate: '',
      vatTaxRegistrationCertificateFile: undefined,
      vatTaxRegistrationIssuingDate: '',
      vatTaxRegistrationExpireDate: '',

      apFirstName: '',
      apLastName: '',
      apEmail: '',
      apPhoneNumber: '',
      apID: '',
      apIDFile: undefined,
      apPowerOfAttorney: '',
      apPowerOfAttorneyFile: undefined,
      apIsMentioned: false,

      bankIban: '',
      bankName: '',
      bankCity: '',
      bankBeneficiaryName: '',
      bankProofDocument: '',
      bankProofDocumentFile: undefined,
    },
  });

  const wchGender = watch('gender');
  const wchType = watch('type');
  const wchCountry = watch('country');

  const onSelectGender = (value: string) => {
    setValue('gender', value);
  };

  const onSelectType = (value: string) => {
    setValue('type', value);
  };

  const onSelectCountry = (value: string) => {
    setValue('country', value);
    const newCountry = country?.find((items) => items.id === Number(value));
    setSelectedCountry(newCountry);
  };

  const onChangeStatus = (isActive: boolean) => {
    if (isActive) {
      setValue('apIsMentioned', true);
      setIsChecked(true);
    } else {
      setValue('apIsMentioned', false);
      setIsChecked(false);
    }
  };

  const handleActualSubmit: SubmitHandler<TPrincipal> = useCallback(
    (values: TPrincipal) => {
      // 5 PDF Documents
      console.log('checkValueees', values);
      toast.success('Vendor Added');
      setTimeout(() => {
        router.back();
      }, 2000);
    },
    [router],
  );

  return (
    <form
      onSubmit={handleSubmit(handleActualSubmit)}
      className=" w-full p-6"
    >
      <div className=" w-full rounded-lg border p-5">
        {/* begin: breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-neutral-500">
          <a
            role="presentation"
            onClick={() => router.back()}
            style={{ cursor: 'pointer' }}
          >
            List Vendor
          </a>
          <FaChevronRight size={12} />
          <p className=" text-primary">Add Vendor</p>
        </div>
        {/* end: breadcrumb */}

        {/* begin: vendor detail */}
        <Accordion
          type="multiple"
          defaultValue={[
            'basic',
            'location',
            'company-detail',
            'company-registration',
            'vat',
            'authorized-person',
            'bank-info',
          ]}
          // collapsible
        >
          {/* begin: basic */}
          <AccordionItem
            value="basic"
            className=" mt-6"
          >
            <AccordionTrigger className="text-lg font-medium text-neutral-800">
              Basic Information
            </AccordionTrigger>
            <AccordionContent>
              <div className=" mt-6 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label>Username</Label>
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
                  <div className="flex flex-col gap-2"></div>
                  <div className="flex flex-col gap-2">
                    <Label>First Name</Label>
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
                  <div className="flex flex-col gap-2">
                    <Label>Last Name</Label>
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
                  <div className="flex flex-col gap-2">
                    <Label>Phone Number</Label>
                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Phone Number"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.phoneNumber?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Email</Label>
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
                  <div className="flex flex-col gap-2">
                    <Label>Note</Label>
                    <Controller
                      name="note"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Note"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.note?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>BCID</Label>
                    <Controller
                      name="bcid"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input BCID"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.bcid?.message}
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
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </SelectUI>
                    <span className="font-small text-sm text-red-600">
                      {errors.gender?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Type</Label>
                    <SelectUI
                      onValueChange={(value) => onSelectType(value)}
                      // defaultValue={wchGender}
                      value={wchType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Vendor Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vendor">Vendor</SelectItem>
                        <SelectItem value="manufacture">Manufacture</SelectItem>
                      </SelectContent>
                    </SelectUI>
                    <span className="font-small text-sm text-red-600">
                      {errors.type?.message}
                    </span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* end: basic */}

          {/* begin: location */}
          <AccordionItem
            value="location"
            className=" mt-6"
          >
            <AccordionTrigger className="text-lg font-medium text-neutral-800">
              Location
            </AccordionTrigger>
            <AccordionContent>
              <div className=" mt-6 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className=" flex flex-col gap-2">
                    <Label>Country</Label>
                    <SelectUI
                      onValueChange={(value) => onSelectCountry(value)}
                      // defaultValue={wchGender}
                      value={wchCountry}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your country here" />
                      </SelectTrigger>
                      <SelectContent>
                        {country?.map((items) => (
                          <SelectItem
                            value={items.id.toString()}
                            key={Math.random()}
                          >
                            {getLang(params, items.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectUI>
                    <span className="font-small text-sm text-red-600">
                      {errors.country?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>City</Label>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input City"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.city?.message}
                    </span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* end: location */}

          {/* begin: company detail */}
          <AccordionItem
            value="company-detail"
            className=" mt-6"
          >
            <AccordionTrigger className="text-lg font-medium text-neutral-800">
              Company Detail
            </AccordionTrigger>
            <AccordionContent>
              <div className=" mt-6 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label>Company Phone Number</Label>
                    <Controller
                      name="companyNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Company Phone Number"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.companyNumber?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2"></div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Name (English)</Label>
                    <Controller
                      name="companyNameEn"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Company Name (English)"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.companyNameEn?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Name (Arabic)</Label>
                    <Controller
                      name="companyNameAr"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          dir="rtl"
                          placeholder="Input Company Name (Arabic)"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.companyNameAr?.message}
                    </span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* end: company detail */}

          {/* begin: commercial registration */}
          <AccordionItem
            value="company-registration"
            className=" mt-6"
          >
            <AccordionTrigger className="text-lg font-medium text-neutral-800">
              Commercial Registration
            </AccordionTrigger>
            <AccordionContent>
              <div className=" mt-6 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label>Commercial Registration Number</Label>
                    <Controller
                      name="crNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Commercial Registration Number"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.crNumber?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>National Unified Number</Label>
                    <Controller
                      name="crNationalUnifiedNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input National Unified Number"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.crNationalUnifiedNumber?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Trade Name (English)</Label>
                    <Controller
                      name="crCompanyTradeNameEn"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Company Trade Name (English)"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.crCompanyTradeNameEn?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Trade Name (Arabic)</Label>
                    <Controller
                      name="crCompanyTradeNameAr"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          dir="rtl"
                          placeholder="Input Company Trade Name (Arabic)"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.crCompanyTradeNameAr?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Type</Label>
                    <Controller
                      name="crCompanyType"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Company Type"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.crCompanyType?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Address</Label>
                    <Controller
                      name="crCompanyAddress"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Company Address"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.crCompanyAddress?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Latitude</Label>
                    <Controller
                      name="crCompanyLat"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Company Latitude"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.crCompanyLat?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Longitude</Label>
                    <Controller
                      name="crCompanyLng"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Company Longitude"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.crCompanyLng?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Commercial Registration Document (.pdf)</Label>
                    <input
                      type="file"
                      className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                      id="upload-thumb"
                      accept=".pdf,"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setValue('crDocumentFile', file);
                        }
                      }}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.crDocumentFile?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Commercial Registration Document Issuing Date</Label>
                    <Controller
                      name="crDocumentIssueDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          className="datepicker"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.crDocumentIssueDate?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Commercial Registration Document Expire Date</Label>
                    <Controller
                      name="crDocumentExpireDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          className="datepicker"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.crDocumentExpireDate?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Activities</Label>
                    <Controller
                      name="crCompanyActivities"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Company Activities"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.crCompanyActivities?.message}
                    </span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* end: commercial registration */}

          {/* begin: vat */}
          <AccordionItem
            value="vat"
            className=" mt-6"
          >
            <AccordionTrigger className="text-lg font-medium text-neutral-800">
              VAT
            </AccordionTrigger>
            <AccordionContent>
              <div className=" mt-6 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label>VAT Type</Label>
                    <Controller
                      name="vatType"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input VAT Type"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.vatType?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>VAT Registration Number</Label>
                    <Controller
                      name="vatTaxRegistrationNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input VAT Registration Number"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.vatTaxRegistrationNumber?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>VAT Registration Certificate (.pdf)</Label>
                    <input
                      type="file"
                      className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                      id="upload-thumb"
                      accept=".pdf,"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setValue('vatTaxRegistrationCertificateFile', file);
                        }
                      }}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.vatTaxRegistrationCertificateFile?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Vat Registration Certificate Issuing Date</Label>
                    <Controller
                      name="vatTaxRegistrationIssuingDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          className="datepicker"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.vatTaxRegistrationIssuingDate?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Vat Registration Certificate Expire Date</Label>
                    <Controller
                      name="vatTaxRegistrationExpireDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          className="datepicker"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.vatTaxRegistrationExpireDate?.message}
                    </span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* end: vat */}

          {/* begin: authorized person */}
          <AccordionItem
            value="authorized-person"
            className=" mt-6"
          >
            <AccordionTrigger className="text-lg font-medium text-neutral-800">
              Authorized Person
            </AccordionTrigger>
            <AccordionContent>
              <div className=" mt-6 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label>Authorized Person First Name</Label>
                    <Controller
                      name="apFirstName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Authorized Person First Name"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.apFirstName?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Authorized Person Last Name</Label>
                    <Controller
                      name="apLastName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Authorized Person Last Name"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.apLastName?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Authorized Person Email</Label>
                    <Controller
                      name="apEmail"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Authorized Person Email"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.apEmail?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Authorized Person Phone Number</Label>
                    <Controller
                      name="apPhoneNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Authorized Person Phone Number"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.apPhoneNumber?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Authorized Person ID (.pdf)</Label>
                    <input
                      type="file"
                      className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                      id="upload-thumb"
                      accept=".pdf,"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setValue('apIDFile', file);
                        }
                      }}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.apIDFile?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Authorized Person Power Of Attorney (.pdf)</Label>
                    <input
                      type="file"
                      className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                      id="upload-thumb"
                      accept=".pdf,"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setValue('apPowerOfAttorneyFile', file);
                        }
                      }}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.apPowerOfAttorneyFile?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Is Authorized Person Mentinoned</Label>
                    <Switch
                      checked={isChecked}
                      onCheckedChange={(e) => onChangeStatus(e)}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.apIsMentioned?.message}
                    </span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* end: authorized person */}

          {/* begin: bank info */}
          <AccordionItem
            value="bank-info"
            className=" mt-6"
          >
            <AccordionTrigger className="text-lg font-medium text-neutral-800">
              Bank Information
            </AccordionTrigger>
            <AccordionContent>
              <div className=" mt-6 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label>Bank IBAN</Label>
                    <Controller
                      name="bankIban"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Bank IBAN"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.bankIban?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Bank Name</Label>
                    <Controller
                      name="bankName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Bank Name"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.bankName?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>City</Label>
                    <Controller
                      name="bankCity"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Bank City"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.bankCity?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Beneficiary Name</Label>
                    <Controller
                      name="bankBeneficiaryName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Beneficiary Name"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.bankBeneficiaryName?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Bank Proof Document (.pdf)</Label>
                    <input
                      type="file"
                      className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                      id="upload-thumb"
                      accept=".pdf,"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setValue('bankProofDocumentFile', file);
                        }
                      }}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.bankProofDocumentFile?.message}
                    </span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* end: bank info */}
        </Accordion>
        {/* end: vendor detail */}
      </div>
      <div className=" mt-8 flex justify-end">
        <Button type="submit">Add Vendor</Button>
      </div>
    </form>
  );
}
