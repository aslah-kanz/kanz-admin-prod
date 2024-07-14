'use client';

import { useGetCountries } from '@/api/country.api';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { TDefaultParams } from '@/types/common.type';
import { TPrincipal } from '@/types/principal.type';
import { textTruncate } from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaChevronRight } from 'react-icons/fa6';

export default function VendorDetailPage({
  params,
}: Readonly<{
  params: TDefaultParams & { id: string };
}>) {
  // const [selectedCountry, setSelectedCountry] =
  //   useState<Partial<TCountry> | null>();
  // const [isChecked, setIsChecked] = useState<boolean>(false);

  const { data: _country } = useGetCountries();

  const router = useRouter();
  // const queryClient = useQueryClient();

  // const { mutate: addVendor, isLoading: loadingAddVendor } = useAddPrincipals();
  // const { mutate: updateVendor, isLoading: loadingUpdateVendor } =
  //   useUpdatePrincipals();

  // const [liveEditCrDoc, setLiveEditCrDoc] = useState<boolean>(false);
  // const [liveEditVatRegCert, setLiveEditVatRegCert] = useState<boolean>(false);
  // const [liveEditApId, setLiveEditApId] = useState<boolean>(false);
  // const [liveEditApPowerOfAttorney, setLiveEditApPowerOfAttorney] =
  //   useState<boolean>(false);
  // const [liveEditBankProof, setLiveEditBankProof] = useState<boolean>(false);

  // const onChangeStatus = (isActive: boolean) => {
  //   if (isActive) {
  //     setIsChecked(true);
  //   } else {
  //     setIsChecked(false);
  //   }
  // };

  // const { data: getDetailVendor } = useGetPrincipalsById(params.id);

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

  return (
    <div className=" w-full p-6">
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
          <p className=" text-primary">Detail Vendor</p>
        </div>
        {/* end: breadcrumb */}

        {/* begin: vendor detail */}
        <Accordion
          type="multiple"
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
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.username}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2"></div>
                  <div className="flex flex-col gap-2">
                    <Label>First Name</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.firstName}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Last Name</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.lastName}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Phone Number</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.phoneNumber}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Email</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.email}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Note</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.note}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>BCID</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.bcId}
                    </span>
                  </div>
                  <div className=" flex flex-col gap-2">
                    <Label className=" text-sm">Date of Birth</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.dob}
                    </span>
                  </div>
                  <div className=" flex flex-col gap-2">
                    <Label className=" text-sm">Gender</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.gender}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Type</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.type}
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
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.details?.country.name
                        ? getLang(
                            params,
                            FAKE_VENDOR_DETAIL.details.country.name,
                          )
                        : '-'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>City</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.details?.city}
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
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.details?.companyNumber}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2"></div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Name English</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.details?.companyNameEn}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Name Arabic</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.details?.companyNameAr}
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
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) =>
                            items.description ===
                            'commercialRegistration.number',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>National Unified Number</Label>
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) =>
                            items.description ===
                            'commercialRegistration.nationalUnifiedNumber',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Trade Name (English)</Label>
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) =>
                            items.description ===
                            'commercialRegistration.companyTradeNameEn',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Trade Name (Arabic)</Label>
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) =>
                            items.description ===
                            'commercialRegistration.companyTradeNameAr',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Type</Label>
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) =>
                            items.description ===
                            'commercialRegistration.companyType',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Address</Label>
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) =>
                            items.description ===
                            'commercialRegistration.companyAddress',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Latitude</Label>
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) =>
                            items.description ===
                            'commercialRegistration.companyLat',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Longitude</Label>
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) =>
                            items.description ===
                            'commercialRegistration.companyLong',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="mr-4">
                      Commercial Registration Document (.pdf)
                    </Label>
                    {FAKE_VENDOR_DETAIL.details?.items?.find(
                      (items) =>
                        items.description ===
                        'commercialRegistration.documents',
                    )?.value ? (
                      <Link
                        target="_blank"
                        href={
                          FAKE_VENDOR_DETAIL.details?.items?.find(
                            (items) =>
                              items.description ===
                              'commercialRegistration.documents',
                          )?.value as string
                        }
                      >
                        {textTruncate(
                          FAKE_VENDOR_DETAIL.details?.items?.find(
                            (items) =>
                              items.description ===
                              'commercialRegistration.documents',
                          )?.value as string,
                          50,
                        )}
                      </Link>
                    ) : (
                      <span className="text-lg font-medium text-primary">
                        -
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Commercial Registration Document Issuing Date</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.details?.items?.find(
                        (items) =>
                          items.description ===
                          'commercialRegistration.issueDate',
                      )?.value
                        ? format(
                            new Date(
                              FAKE_VENDOR_DETAIL.details?.items?.find(
                                (items) =>
                                  items.description ===
                                  'commercialRegistration.issueDate',
                              )?.value as string,
                            ),
                            'yyyy-MM-dd',
                          )
                        : ''}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Commercial Registration Document Expire Date</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.details?.items?.find(
                        (items) =>
                          items.description ===
                          'commercialRegistration.expireDate',
                      )?.value
                        ? format(
                            new Date(
                              FAKE_VENDOR_DETAIL.details?.items?.find(
                                (items) =>
                                  items.description ===
                                  'commercialRegistration.expireDate',
                              )?.value as string,
                            ),
                            'yyyy-MM-dd',
                          )
                        : ''}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company Activities</Label>
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) =>
                            items.description ===
                            'commercialRegistration.companyActivities',
                        )?.value
                      }
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
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) => items.description === 'vat.vatType',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>VAT Registration Number</Label>
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) =>
                            items.description === 'vat.taxRegistrationNumber',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="mr-4">
                      VAT Registration Certificate (.pdf)
                    </Label>
                    {FAKE_VENDOR_DETAIL.details?.items?.find(
                      (items) =>
                        items.description === 'vat.registrationCertificate',
                    )?.value ? (
                      <Link
                        target="_blank"
                        href={
                          FAKE_VENDOR_DETAIL.details?.items?.find(
                            (items) =>
                              items.description ===
                              'vat.registrationCertificate',
                          )?.value as string
                        }
                      >
                        {
                          FAKE_VENDOR_DETAIL.details?.items?.find(
                            (items) =>
                              items.description ===
                              'vat.registrationCertificate',
                          )?.value
                        }
                      </Link>
                    ) : (
                      <span className="text-lg font-medium text-primary">
                        -
                      </span>
                    )}
                    <span className="text-lg font-medium text-primary">{}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Vat Registration Certificate Issuing Date</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.details?.items?.find(
                        (items) => items.description === 'vat.issuingDate',
                      )?.value
                        ? format(
                            new Date(
                              FAKE_VENDOR_DETAIL.details?.items?.find(
                                (items) =>
                                  items.description === 'vat.issuingDate',
                              )?.value as string,
                            ),
                            'yyyy-MM-dd',
                          )
                        : ''}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Vat Registration Certificate Expire Date</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.details?.items?.find(
                        (items) => items.description === 'vat.expireDate',
                      )?.value
                        ? format(
                            new Date(
                              FAKE_VENDOR_DETAIL.details?.items?.find(
                                (items) =>
                                  items.description === 'vat.expireDate',
                              )?.value as string,
                            ),
                            'yyyy-MM-dd',
                          )
                        : ''}
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
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) =>
                            items.description === 'authorizedPerson1.firstName',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Authorized Person Last Name</Label>
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) =>
                            items.description === 'authorizedPerson1.lastName',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Authorized Person Email</Label>
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) =>
                            items.description === 'authorizedPerson1.email',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Authorized Person Phone Number</Label>
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) =>
                            items.description === 'authorizedPerson1.phone',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="mr-4">Authorized Person ID (.pdf)</Label>
                    {FAKE_VENDOR_DETAIL.details?.items?.find(
                      (items) =>
                        items.description === 'authorizedPerson1.uploadId',
                    )?.value ? (
                      <Link
                        target="_blank"
                        href={
                          FAKE_VENDOR_DETAIL.details?.items?.find(
                            (items) =>
                              items.description ===
                              'authorizedPerson1.uploadId',
                          )?.value as string
                        }
                      >
                        {textTruncate(
                          FAKE_VENDOR_DETAIL.details?.items?.find(
                            (items) =>
                              items.description ===
                              'authorizedPerson1.uploadId',
                          )?.value as string,
                          50,
                        )}
                      </Link>
                    ) : (
                      <span className="text-lg font-medium text-primary">
                        -
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="mr-4">
                      Authorized Person Power Of Attorney (.pdf)
                    </Label>
                    {FAKE_VENDOR_DETAIL.details?.items?.find(
                      (items) =>
                        items.description ===
                        'authorizedPerson1.powerOfAttorney',
                    )?.value ? (
                      <Link
                        target="_blank"
                        href={
                          FAKE_VENDOR_DETAIL.details?.items?.find(
                            (items) =>
                              items.description ===
                              'authorizedPerson1.powerOfAttorney',
                          )?.value as string
                        }
                      >
                        {textTruncate(
                          FAKE_VENDOR_DETAIL.details?.items?.find(
                            (items) =>
                              items.description ===
                              'authorizedPerson1.powerOfAttorney',
                          )?.value as string,
                          50,
                        )}
                      </Link>
                    ) : (
                      <span className="text-lg font-medium text-primary">
                        -
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Is Authorized Person Mentinoned</Label>
                    <span className="text-lg font-medium text-primary">
                      {FAKE_VENDOR_DETAIL.details?.items?.find(
                        (items) =>
                          items.description ===
                          'authorizedPerson1.powerOfAttorney',
                      )?.value
                        ? 'Yes'
                        : 'No'}
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
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) => items.description === 'bankInfo.iban',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Bank Name</Label>
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) => items.description === 'bankInfo.bankName',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>City</Label>
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) => items.description === 'bankInfo.bankCity',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Beneficiary Name</Label>
                    <span className="text-lg font-medium text-primary">
                      {
                        FAKE_VENDOR_DETAIL.details?.items?.find(
                          (items) =>
                            items.description === 'bankInfo.beneficiaryName',
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="mr-4">Bank Proof Document (.pdf)</Label>
                    {FAKE_VENDOR_DETAIL.details?.items?.find(
                      (items) => items.description === 'bankInfo.proofDocument',
                    )?.value ? (
                      <Link
                        target="_blank"
                        href={
                          FAKE_VENDOR_DETAIL.details?.items?.find(
                            (items) =>
                              items.description === 'bankInfo.proofDocument',
                          )?.value as string
                        }
                      >
                        {textTruncate(
                          FAKE_VENDOR_DETAIL.details?.items?.find(
                            (items) =>
                              items.description === 'bankInfo.proofDocument',
                          )?.value as string,
                          50,
                        )}
                      </Link>
                    ) : (
                      <span className="text-lg font-medium text-primary">
                        -
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* end: bank info */}
        </Accordion>
        {/* end: vendor detail */}
      </div>
    </div>
  );
}
