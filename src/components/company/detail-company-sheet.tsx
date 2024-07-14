import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import useDetailCompanySheetStore from '@/store/detail-company-sheet.store';
import { textTruncate } from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import { useParams } from 'next/navigation';
import { FiX } from 'react-icons/fi';
import { Badge } from '../ui/badge';

function DetailCompanySheet() {
  const { isOpen, onChangeOpen, initialValue, setInitialValue } =
    useDetailCompanySheetStore();
  // console.log('checkCompanyDetail', initialValue);
  const params = useParams();

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        onChangeOpen(open);
        setInitialValue(null);
      }}
    >
      <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
        <SheetHeader className=" sticky top-0 gap-2 bg-white pt-4">
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
            <Label className=" text-sm">Name</Label>
            <p className=" text-sm font-medium text-neutral-500">{`${initialValue?.firstName} ${initialValue?.lastName}`}</p>
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
              {initialValue
                ? textTruncate(
                    `${initialValue.countryCode}${initialValue.phoneNumber}`,
                    25,
                  )
                : '-'}
            </p>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Company Name</Label>
            <p className=" text-sm font-medium text-neutral-500">
              {initialValue?.principalDetails
                ? initialValue?.principalDetails[0]?.companyNameEn
                : '-'}
            </p>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Address</Label>
            <p className=" text-sm font-medium text-neutral-500">
              {`${initialValue?.principalDetails ? initialValue?.principalDetails[0]?.city : '-'}, 
              ${
                initialValue?.principalDetails &&
                initialValue?.principalDetails[0]?.country?.name
                  ? getLang(
                      params,
                      initialValue?.principalDetails[0]?.country?.name,
                    )
                  : '-'
              }`}
            </p>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Status</Label>
            {initialValue?.status === 'active' ? (
              <Badge
                className=" h-8 w-fit px-2.5"
                variant="green"
              >
                Active
              </Badge>
            ) : (
              <Badge
                className=" h-8 w-fit px-2.5"
                variant="neutral"
              >
                Inactive
              </Badge>
            )}
          </div>
          {/* end: main form */}
        </div>

        {/* <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
          <Button
            onClick={() => {
              setShowDetailCompany((prev) => !prev);
              setShowApprove((prev) => !prev);
            }}
            className=" gap-2"
          >
            Approve
          </Button>
          <Button
            onClick={() => {
              setShowDetailCompany((prev) => !prev);
              setShowReject((prev) => !prev);
            }}
            className=" gap-2 text-primary"
            variant="ghost"
          >
            Reject
          </Button>
        </div> */}
      </SheetContent>
    </Sheet>
  );
}

export default DetailCompanySheet;
