import React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { FiX } from 'react-icons/fi';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import useDetailAdminSheetStore from '@/store/detail-admin-sheet.store';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getBadgeVariant } from '@/utils/common.util';
import {
  useApprovePrincipals,
  useRejectPrincipals,
} from '@/api/principals.api';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import { HTTP_STATUS } from '@/constants/common.constant';
import { formatStatus } from '@/utils/principal';
import { TPrincipalDetail } from '@/types/principal.type';
import { getLang } from '@/utils/locale.util';

function DetailAdminSheet({ type }: { type?: string }) {
  const params = useParams();
  const { isOpen, initialValue, onChangeOpen, setInitialValue } =
    useDetailAdminSheetStore();

  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: mutateApprove, isLoading: isLoadingApprove } =
    useApprovePrincipals();
  const handleApprove = () => {
    mutateApprove(
      { id: Number(initialValue?.id) },
      {
        onSuccess: (resp) => {
          if (resp.code === HTTP_STATUS.SUCCESS) {
            onChangeOpen(false);
            queryClient.invalidateQueries({ queryKey: ['getPrincipalList'] });
            queryClient.invalidateQueries({ queryKey: ['getPrincipalById'] });
            queryClient.removeQueries({ queryKey: ['getPrincipalList'] });
            queryClient.removeQueries({ queryKey: ['getPrincipalById'] });
            router.refresh();
            toast.success('Principal Approved');
          } else {
            toast.error(resp.message);
          }
        },
      },
    );
  };

  const { mutate: mutateReject, isLoading: isLoadingReject } =
    useRejectPrincipals();
  const handleReject = () => {
    mutateReject(
      { id: Number(initialValue?.id) },
      {
        onSuccess: (resp) => {
          if (resp.code === HTTP_STATUS.SUCCESS) {
            onChangeOpen(false);
            queryClient.invalidateQueries({ queryKey: ['getPrincipalList'] });
            queryClient.invalidateQueries({ queryKey: ['getPrincipalById'] });
            queryClient.removeQueries({ queryKey: ['getPrincipalList'] });
            queryClient.removeQueries({ queryKey: ['getPrincipalById'] });
            router.refresh();
            toast.success('Principal Reject');
          } else {
            toast.error(resp.message);
          }
        },
      },
    );
  };

  React.useEffect(() => {
    return () => {
      onChangeOpen(false);
      setInitialValue(null);
    };
  }, [onChangeOpen, setInitialValue]);

  const renderPrincipalDetail = (value: TPrincipalDetail) => {
    return (
      <div className=" rounded-lg border p-4">
        <div className=" mb-4 flex flex-col gap-2">
          <Label className=" text-sm">Company Name</Label>
          <p className=" text-sm font-medium text-neutral-500">
            {params.locale === 'ar' ? value.companyNameAr : value.companyNameEn}
          </p>
        </div>
        <div className=" mb-4 flex flex-col gap-2">
          <Label className=" text-sm">Company Number</Label>
          <p className=" text-sm font-medium text-neutral-500">
            {value.companyNumber}
          </p>
        </div>
        <div className=" mb-4 flex flex-col gap-2">
          <Label className=" text-sm">Country</Label>
          <p className=" text-sm font-medium text-neutral-500">
            {value.country.name ? getLang(params, value.country.name) : '-'}
          </p>
        </div>
        <div className=" mb-4 flex flex-col gap-2">
          <Label className=" text-sm">City</Label>
          <p className=" text-sm font-medium text-neutral-500">{value.city}</p>
        </div>
        {value.items?.map((item, i) => (
          <div
            key={i}
            className=" mb-4 flex flex-col gap-2"
          >
            <Label className=" text-sm">{item.description}</Label>
            <p className=" text-sm font-medium text-neutral-500">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Sheet
      // open
      open={isOpen}
      onOpenChange={(open) => {
        onChangeOpen(open);
        setInitialValue(null);
      }}
    >
      <SheetContent className=" flex flex-col gap-4 overflow-auto overflow-y-auto bg-white p-4 py-0">
        <SheetHeader
          className=" sticky top-0 gap-2 bg-white pt-4"
          style={{ zIndex: 99 }}
        >
          <div className="flex items-center justify-between">
            <SheetTitle>View Details</SheetTitle>
            <SheetClose>
              <FiX />
            </SheetClose>
          </div>
          <hr />
        </SheetHeader>

        <div className=" flex flex-col gap-4">
          {/* begin: main form */}
          <div className=" flex flex-col gap-2">
            {initialValue?.image?.url && (
              <div className=" relative aspect-[2/1] w-full overflow-hidden rounded-lg">
                <Image
                  src={initialValue?.image.url}
                  alt="profile"
                  fill
                  className=" object-cover object-center"
                />
              </div>
            )}
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Name</Label>
            <p className=" text-sm font-medium text-neutral-500">{`${initialValue?.firstName} ${initialValue?.lastName}`}</p>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Username</Label>
            <p className=" text-sm font-medium text-neutral-500">
              {initialValue?.username}
            </p>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Email</Label>
            <p className=" text-sm font-medium text-neutral-500">
              {initialValue?.email}
            </p>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Phone Number</Label>
            <p className=" text-sm font-medium text-neutral-500">
              {initialValue?.phoneNumber}
            </p>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Birth Date</Label>
            <p className=" text-sm font-medium text-neutral-500">
              {initialValue?.birthDate}
            </p>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Gender</Label>
            <p className=" text-sm font-medium text-neutral-500">
              {initialValue?.gender}
            </p>
          </div>
          {initialValue?.roles?.length && (
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Role</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {initialValue?.roles?.length! > 0 &&
                  initialValue?.roles?.map((roles, index) => {
                    let newRoles: string = '';
                    if (index + 1 === initialValue?.roles?.length) {
                      newRoles = roles?.name!;
                    } else {
                      newRoles = `${roles.name}, `;
                    }
                    return newRoles;
                  })}
              </p>
            </div>
          )}
          {initialValue?.stores?.length && (
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Stores</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {initialValue?.stores?.length! > 0
                  ? initialValue?.stores?.map((stores, index) => {
                      let newRoles: string = '';
                      if (index + 1 === initialValue?.stores?.length) {
                        newRoles = stores?.name!;
                      } else {
                        newRoles = `${stores.name}, `;
                      }
                      return newRoles;
                    })
                  : '-'}
              </p>
            </div>
          )}
          {initialValue?.departments?.length && (
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Departments</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {initialValue?.departments?.length! > 0
                  ? initialValue?.departments?.map((departments, index) => {
                      let newRoles: string = '';
                      if (index + 1 === initialValue?.departments?.length) {
                        newRoles = departments?.name!;
                      } else {
                        newRoles = `${departments.name}, `;
                      }
                      return newRoles;
                    })
                  : '-'}
              </p>
            </div>
          )}
          {initialValue?.principalDetails?.length && (
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">
                {type === 'company' ? 'Company' : 'Details'}
              </Label>
              {renderPrincipalDetail(initialValue.principalDetails[0])}
              {/* <p className=" text-sm font-medium text-neutral-500">
                {initialValue?.principalDetails?.length! > 0
                  ? initialValue?.principalDetails?.map(
                      (principalDetails, index) => {
                        let newRoles: string = '';
                        if (
                          index + 1 ===
                          initialValue?.principalDetails?.length
                        ) {
                          newRoles = getLang(params, {
                            en: principalDetails?.companyNameEn,
                            ar: principalDetails?.companyNameAr,
                          })!;
                        } else {
                          newRoles = `${getLang(params, {
                            en: principalDetails?.companyNameEn,
                            ar: principalDetails?.companyNameAr,
                          })}, `;
                        }
                        return newRoles;
                      },
                    )
                  : '-'}
              </p> */}
            </div>
          )}
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Status</Label>
            <Badge
              variant={
                initialValue?.status
                  ? getBadgeVariant(initialValue.status)
                  : 'default'
              }
            >
              {formatStatus(initialValue?.status || '')}
            </Badge>
          </div>
          {/* end: main form */}
          {initialValue?.status === 'pendingApproval' && (
            <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
              <Button
                type="button"
                disabled={isLoadingApprove}
                onClick={() => {
                  handleApprove();
                }}
              >
                Approve
              </Button>
              <Button
                type="button"
                variant="outline-primary"
                disabled={isLoadingReject}
                onClick={() => {
                  handleReject();
                }}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default DetailAdminSheet;
