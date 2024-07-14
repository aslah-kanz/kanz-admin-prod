'use client';

import { useGetCountries } from '@/api/country.api';
import Pencxil from '@/components/svg/Pencxil';
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
import { TDefaultParams } from '@/types/common.type';
import { TCountry } from '@/types/country.type';
import { TPrincipal } from '@/types/principal.type';
import { getLang } from '@/utils/locale.util';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FaChevronRight } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';
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
  crDocument: yup.string().required('required').label('Comercial Reg Document'),
  crDocumentFile: yup
    .mixed<File>()
    .test('fileFormat', 'Unsupported Format', (value) =>
      value ? SUPPORTED_FORMATS.includes(value.type) : true,
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
    .required('required')
    .label('Tax registration Certificate'),
  vatTaxRegistrationCertificateFile: yup
    .mixed<File>()
    .test('fileFormat', 'Unsupported Format', (value) =>
      value ? SUPPORTED_FORMATS.includes(value.type) : true,
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
  apID: yup.string().required('required').label('Authorized Person ID'),
  apIDFile: yup
    .mixed<File>()
    .test('fileFormat', 'Unsupported Format', (value) =>
      value ? SUPPORTED_FORMATS.includes(value.type) : true,
    ),
  apPowerOfAttorney: yup
    .string()
    .required('required')
    .label('Authorized Person Power of Attorney'),
  apPowerOfAttorneyFile: yup
    .mixed<File>()
    .test('fileFormat', 'Unsupported Format', (value) =>
      value ? SUPPORTED_FORMATS.includes(value.type) : true,
    ),
  apIsMentioned: yup.boolean(),

  bankIban: yup.string().required('required').label('Bank IBAN'),
  bankName: yup.string().required('required').label('Bank Name'),
  bankCity: yup.string().required('required').label('Bank City'),
  bankBeneficiaryName: yup
    .string()
    .required('required')
    .label('Bank Beneficiary Name'),
  bankProofDocument: yup
    .string()
    .required('required')
    .label('Bank Beneficiary Name'),
  bankProofDocumentFile: yup
    .mixed<File>()
    .test('fileFormat', 'Unsupported Format', (value) =>
      value ? SUPPORTED_FORMATS.includes(value.type) : true,
    ),
});

export default function EditVendorPage({
  params,
}: Readonly<{
  params: TDefaultParams & { id: string };
}>) {
  const [_selectedCountry, setSelectedCountry] =
    useState<Partial<TCountry> | null>();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { data: country } = useGetCountries();

  const router = useRouter();
  // const queryClient = useQueryClient();

  // const { mutate: addVendor, isLoading: loadingAddVendor } = useAddPrincipals();
  // const { mutate: updateVendor, isLoading: loadingUpdateVendor } =
  //   useUpdatePrincipals();

  const [liveEditCrDoc, setLiveEditCrDoc] = useState<boolean>(false);
  const [liveEditVatRegCert, setLiveEditVatRegCert] = useState<boolean>(false);
  const [liveEditApId, setLiveEditApId] = useState<boolean>(false);
  const [liveEditApPowerOfAttorney, setLiveEditApPowerOfAttorney] =
    useState<boolean>(false);
  const [liveEditBankProof, setLiveEditBankProof] = useState<boolean>(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
    // reset,
    setValue,
    getValues,
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
      toast.success('Vendor Updated');
      setTimeout(() => {
        router.back();
      }, 2000);
    },
    [router],
  );

  // const { data: getDetailVendor } = useGetPrincipalsById(params.id);

  useEffect(() => {
    const FAKE_VENDOR_DETAIL: TPrincipal = {
      id: 1,
      code: '001',
      type: 'vendor',
      username: 'seller01',
      firstName: 'Jhone',
      lastName: 'Doe',
      phoneNumber: '0857766484',
      email: 'jhon@mail.com',
      roles: [
        {
          id: 1,
          name: 'Admin',
        },
      ],
      note: 'tes',
      bcId: 'aaaaa',
      dob: '1990-10-01',
      gender: 'Male',
      profilePicture: 'https://picsum.photos/800/600',
      details: {
        city: 'Bandung',
        country: {
          id: 11,
          name: {
            en: 'Saudi Arabia',
            ar: 'المملكة العربية السعودية',
          },
        },
        companyNumber: '99484855445',
        companyNameEn: 'ABC Store',
        companyNameAr: 'محرك بدون فتحات',
        items: [
          {
            description: 'commercialRegistration.number',
            value: '88377XXX',
          },
          {
            description: 'commercialRegistration.nationalUnifiedNumber',
            value: '994884XXX',
          },
          {
            description: 'commercialRegistration.companyTradeNameEn',
            value: 'company',
          },
          {
            description: 'commercialRegistration.companyTradeNameAr',
            value: 'company',
          },
          {
            description: 'commercialRegistration.companyType',
            value: 'company type',
          },
          {
            description: 'commercialRegistration.companyAddress',
            value: 'Jl. Jalan',
          },
          {
            description: 'commercialRegistration.companyLong',
            value: '100933',
          },
          {
            description: 'commercialRegistration.companyLat',
            value: '394984',
          },
          {
            description: 'commercialRegistration.issueDate',
            value: '2024-01-10',
          },
          {
            description: 'commercialRegistration.expireDate',
            value: '2024-01-10',
          },
          {
            description: 'commercialRegistration.documents',
            value:
              'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          },
          {
            description: 'commercialRegistration.companyActivities',
            value: 'test',
          },
          {
            description: 'vat.vatType',
            value: 'vat type',
          },
          {
            description: 'vat.taxRegistrationNumber',
            value: '74776TAX',
          },
          {
            description: 'vat.issuingDate',
            value: '2024-01-10',
          },
          {
            description: 'vat.expireDate',
            value: '2024-01-10',
          },
          {
            description: 'vat.registrationCertificate',
            value:
              'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          },
          {
            description: 'authorizedPerson1.firstName',
            value: 'jhon',
          },
          {
            description: 'authorizedPerson1.lastName',
            value: 'doe',
          },
          {
            description: 'authorizedPerson1.email',
            value: 'email@kanzway.com',
          },
          {
            description: 'authorizedPerson1.phone',
            value: '0383784343',
          },
          {
            description: 'authorizedPerson1.uploadId',
            value:
              'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          },
          {
            description: 'authorizedPerson1.isMentioned',
            value: true,
          },
          {
            description: 'authorizedPerson1.powerOfAttorney',
            value:
              'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          },
          {
            description: 'bankInfo.iban',
            value: '83773434',
          },
          {
            description: 'bankInfo.bankName',
            value: 'BCA',
          },
          {
            description: 'bankInfo.bankCity',
            value: 'Jakarta',
          },
          {
            description: 'bankInfo.beneficiaryName',
            value: 'Jhon',
          },
          {
            description: 'bankInfo.proofDocument',
            value:
              'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          },
        ],
      },
      status: 'active',
    };
    // if (getDetailVendor) {
    setValue('username', FAKE_VENDOR_DETAIL.username);
    setValue('firstName', FAKE_VENDOR_DETAIL.firstName);
    setValue('lastName', FAKE_VENDOR_DETAIL.lastName);
    setValue('phoneNumber', FAKE_VENDOR_DETAIL.phoneNumber);
    setValue('email', FAKE_VENDOR_DETAIL.email);
    setValue('note', FAKE_VENDOR_DETAIL.note ?? '');
    setValue('bcid', FAKE_VENDOR_DETAIL.bcId ?? '');
    setValue(
      'dob',
      FAKE_VENDOR_DETAIL.dob
        ? format(new Date(FAKE_VENDOR_DETAIL.dob), 'yyyy-MM-dd')
        : '',
    );
    setValue('gender', FAKE_VENDOR_DETAIL.gender ?? '');
    setValue('type', FAKE_VENDOR_DETAIL.type ?? '');

    setValue(
      'country',
      FAKE_VENDOR_DETAIL.details?.country.id?.toString() ?? '',
    );
    setSelectedCountry(FAKE_VENDOR_DETAIL.details?.country);
    setValue('city', FAKE_VENDOR_DETAIL.details?.city ?? '');
    setValue('companyNumber', FAKE_VENDOR_DETAIL.details?.companyNumber ?? '');
    setValue('companyNameEn', FAKE_VENDOR_DETAIL.details?.companyNameEn ?? '');
    setValue('companyNameAr', FAKE_VENDOR_DETAIL.details?.companyNameAr ?? '');

    FAKE_VENDOR_DETAIL.details?.items?.forEach((items) => {
      switch (items.description) {
        case 'commercialRegistration.number':
          setValue('crNumber', items.value as string);
          break;
        case 'commercialRegistration.nationalUnifiedNumber':
          setValue('crNationalUnifiedNumber', items.value as string);
          break;
        case 'commercialRegistration.companyTradeNameEn':
          setValue('crCompanyTradeNameEn', items.value as string);
          break;
        case 'commercialRegistration.companyTradeNameAr':
          setValue('crCompanyTradeNameAr', items.value as string);
          break;
        case 'commercialRegistration.companyType':
          setValue('crCompanyType', items.value as string);
          break;
        case 'commercialRegistration.companyAddress':
          setValue('crCompanyAddress', items.value as string);
          break;
        case 'commercialRegistration.companyLong':
          setValue('crCompanyLng', items.value as string);
          break;
        case 'commercialRegistration.companyLat':
          setValue('crCompanyLat', items.value as string);
          break;
        case 'commercialRegistration.issueDate':
          setValue(
            'crDocumentIssueDate',
            items.value
              ? format(new Date(items.value as string), 'yyyy-MM-dd')
              : '',
          );
          break;
        case 'commercialRegistration.expireDate':
          setValue(
            'crDocumentExpireDate',
            items.value
              ? format(new Date(items.value as string), 'yyyy-MM-dd')
              : '',
          );
          break;
        case 'commercialRegistration.documents':
          setValue('crDocument', items.value as string);
          break;
        case 'commercialRegistration.companyActivities':
          setValue('crCompanyActivities', items.value as string);
          break;

        case 'vat.vatType':
          setValue('vatType', items.value as string);
          break;
        case 'vat.taxRegistrationNumber':
          setValue('vatTaxRegistrationNumber', items.value as string);
          break;
        case 'vat.issuingDate':
          setValue(
            'vatTaxRegistrationIssuingDate',
            items.value
              ? format(new Date(items.value as string), 'yyyy-MM-dd')
              : '',
          );
          break;
        case 'vat.expireDate':
          setValue(
            'vatTaxRegistrationExpireDate',
            items.value
              ? format(new Date(items.value as string), 'yyyy-MM-dd')
              : '',
          );
          break;
        case 'vat.registrationCertificate':
          setValue('vatTaxRegistrationCertificate', items.value as string);
          break;

        case 'authorizedPerson1.firstName':
          setValue('apFirstName', items.value as string);
          break;
        case 'authorizedPerson1.lastName':
          setValue('apLastName', items.value as string);
          break;
        case 'authorizedPerson1.email':
          setValue('apEmail', items.value as string);
          break;
        case 'authorizedPerson1.phone':
          setValue('apPhoneNumber', items.value as string);
          break;
        case 'authorizedPerson1.uploadId':
          setValue('apID', items.value as string);
          break;
        case 'authorizedPerson1.isMentioned':
          setValue('apIsMentioned', items.value as boolean);
          if (items.value as boolean) {
            setIsChecked(true);
          } else {
            setIsChecked(false);
          }
          break;
        case 'authorizedPerson1.powerOfAttorney':
          setValue('apPowerOfAttorney', items.value as string);
          break;

        case 'bankInfo.iban':
          setValue('bankIban', items.value as string);
          break;
        case 'bankInfo.bankName':
          setValue('bankName', items.value as string);
          break;
        case 'bankInfo.bankCity':
          setValue('bankCity', items.value as string);
          break;
        case 'bankInfo.beneficiaryName':
          setValue('bankBeneficiaryName', items.value as string);
          break;
        case 'bankInfo.proofDocument':
          setValue('bankProofDocument', items.value as string);
          break;

        default:
          break;
      }
    });
    // }
  }, [setValue, country]);

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
          <p className=" text-primary">Edit Vendor</p>
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
                    <Label className=" text-sm">Country</Label>
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
                    <Label>Company Name English</Label>
                    <Controller
                      name="companyNameEn"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Company Name"
                        />
                      )}
                    />
                    <span className="font-small text-sm text-red-600">
                      {errors.companyNameEn?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Name Arabic</Label>
                    <Controller
                      name="companyNameAr"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Input Company Name"
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
                    <div>
                      <Label className="mr-4">
                        Commercial Registration Document (.pdf)
                      </Label>
                      {!liveEditCrDoc ? (
                        <button
                          onClick={() => setLiveEditCrDoc((prev) => !prev)}
                        >
                          <Pencxil className=" fill-primary" />
                        </button>
                      ) : (
                        <Button
                          size="icon"
                          variant="destructive"
                          className=" h-8 w-8 "
                          onClick={() => {
                            setLiveEditCrDoc((prev) => !prev);
                            setValue('crDocumentFile', undefined);
                            setValue('crDocument', '');
                          }}
                        >
                          <FiX size={10} />
                        </Button>
                      )}
                    </div>
                    {!liveEditCrDoc ? (
                      <Link
                        href={getValues('crDocument')}
                        target="_blank"
                      >
                        {getValues('crDocument') ?? 'No Document'}
                      </Link>
                    ) : (
                      <input
                        type="file"
                        className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                        id="upload-thumb"
                        accept=".pdf,"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setValue('crDocumentFile', file);
                            setValue('crDocument', URL.createObjectURL(file));
                          }
                        }}
                      />
                    )}
                    <span className="font-small text-sm text-red-600">
                      {errors.crDocumentFile?.message}
                    </span>
                    <span className="font-small text-sm text-red-600">
                      {errors.crDocument?.message}
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
                    <div>
                      <Label className="mr-4">
                        VAT Registration Certificate (.pdf)
                      </Label>
                      {!liveEditVatRegCert ? (
                        <button
                          onClick={() => setLiveEditVatRegCert((prev) => !prev)}
                        >
                          <Pencxil className=" fill-primary" />
                        </button>
                      ) : (
                        <Button
                          size="icon"
                          variant="destructive"
                          className=" h-8 w-8 "
                          onClick={() => {
                            setLiveEditVatRegCert((prev) => !prev);
                            setValue(
                              'vatTaxRegistrationCertificateFile',
                              undefined,
                            );
                            setValue('vatTaxRegistrationCertificate', '');
                          }}
                        >
                          <FiX size={10} />
                        </Button>
                      )}
                    </div>
                    {!liveEditVatRegCert ? (
                      <Link
                        href={getValues('vatTaxRegistrationCertificate')}
                        target="_blank"
                      >
                        {getValues('vatTaxRegistrationCertificate') ??
                          'No Document'}
                      </Link>
                    ) : (
                      <input
                        type="file"
                        className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                        id="upload-thumb"
                        accept=".pdf,"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setValue('vatTaxRegistrationCertificateFile', file);
                            setValue(
                              'vatTaxRegistrationCertificate',
                              URL.createObjectURL(file),
                            );
                          }
                        }}
                      />
                    )}
                    <span className="font-small text-sm text-red-600">
                      {errors.vatTaxRegistrationCertificateFile?.message}
                    </span>
                    <span className="font-small text-sm text-red-600">
                      {errors.vatTaxRegistrationCertificate?.message}
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
                    <div>
                      <Label className="mr-4">
                        Authorized Person ID (.pdf)
                      </Label>
                      {!liveEditApId ? (
                        <button
                          onClick={() => setLiveEditApId((prev) => !prev)}
                        >
                          <Pencxil className=" fill-primary" />
                        </button>
                      ) : (
                        <Button
                          size="icon"
                          variant="destructive"
                          className=" h-8 w-8 "
                          onClick={() => {
                            setLiveEditApId((prev) => !prev);
                            setValue('apIDFile', undefined);
                            setValue('apID', '');
                          }}
                        >
                          <FiX size={10} />
                        </Button>
                      )}
                    </div>
                    {!liveEditApId ? (
                      <Link
                        href={getValues('apID')}
                        target="_blank"
                      >
                        {getValues('apID') ?? 'No Document'}
                      </Link>
                    ) : (
                      <input
                        type="file"
                        className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                        id="upload-thumb"
                        accept=".pdf,"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setValue('apIDFile', file);
                            setValue('apID', URL.createObjectURL(file));
                          }
                        }}
                      />
                    )}
                    <span className="font-small text-sm text-red-600">
                      {errors.apIDFile?.message}
                    </span>
                    <span className="font-small text-sm text-red-600">
                      {errors.apID?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <Label className="mr-4">
                        Authorized Person Power Of Attorney (.pdf)
                      </Label>
                      {!liveEditApPowerOfAttorney ? (
                        <button
                          onClick={() =>
                            setLiveEditApPowerOfAttorney((prev) => !prev)
                          }
                        >
                          <Pencxil className=" fill-primary" />
                        </button>
                      ) : (
                        <Button
                          size="icon"
                          variant="destructive"
                          className=" h-8 w-8 "
                          onClick={() => {
                            setLiveEditApPowerOfAttorney((prev) => !prev);
                            setValue('apPowerOfAttorneyFile', undefined);
                            setValue('apPowerOfAttorney', '');
                          }}
                        >
                          <FiX size={10} />
                        </Button>
                      )}
                    </div>
                    {!liveEditApPowerOfAttorney ? (
                      <Link
                        href={getValues('apPowerOfAttorney')}
                        target="_blank"
                      >
                        {getValues('apPowerOfAttorney') ?? 'No Document'}
                      </Link>
                    ) : (
                      <input
                        type="file"
                        className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                        id="upload-thumb"
                        accept=".pdf,"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setValue('apPowerOfAttorneyFile', file);
                            setValue(
                              'apPowerOfAttorney',
                              URL.createObjectURL(file),
                            );
                          }
                        }}
                      />
                    )}
                    <span className="font-small text-sm text-red-600">
                      {errors.apPowerOfAttorneyFile?.message}
                    </span>
                    <span className="font-small text-sm text-red-600">
                      {errors.apPowerOfAttorney?.message}
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
                    <div>
                      <Label className="mr-4">Bank Proof Document (.pdf)</Label>
                      {!liveEditBankProof ? (
                        <button
                          onClick={() => setLiveEditBankProof((prev) => !prev)}
                        >
                          <Pencxil className=" fill-primary" />
                        </button>
                      ) : (
                        <Button
                          size="icon"
                          variant="destructive"
                          className=" h-8 w-8 "
                          onClick={() => {
                            setLiveEditBankProof((prev) => !prev);
                            setValue('bankProofDocumentFile', undefined);
                            setValue('bankProofDocument', '');
                          }}
                        >
                          <FiX size={10} />
                        </Button>
                      )}
                    </div>
                    {!liveEditBankProof ? (
                      <Link
                        href={getValues('bankProofDocument')}
                        target="_blank"
                      >
                        {getValues('bankProofDocument') ?? 'No Document'}
                      </Link>
                    ) : (
                      <input
                        type="file"
                        className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                        id="upload-thumb"
                        accept=".pdf,"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setValue('bankProofDocumentFile', file);
                            setValue(
                              'bankProofDocument',
                              URL.createObjectURL(file),
                            );
                          }
                        }}
                      />
                    )}
                    <span className="font-small text-sm text-red-600">
                      {errors.bankProofDocumentFile?.message}
                    </span>
                    <span className="font-small text-sm text-red-600">
                      {errors.bankProofDocument?.message}
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
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
