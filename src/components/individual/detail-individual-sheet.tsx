import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import useDetailIndividualSheetStore from '@/store/detail-individual-sheet.store';
import { textTruncate } from '@/utils/common.util';
import { format } from 'date-fns';
import { FiX } from 'react-icons/fi';

function DetailIndividualSheet() {
  const { isOpen, onChangeOpen, initialValue, setInitialValue } =
    useDetailIndividualSheetStore();

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
            <Label className=" text-sm">Username</Label>
            <p className=" text-sm font-medium text-neutral-500">
              {initialValue?.username}
            </p>
          </div>
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
            <Label className=" text-sm">Date of Birth</Label>
            <p className=" text-sm font-medium text-neutral-500">
              {initialValue?.birthDate
                ? format(new Date(initialValue.birthDate), 'dd MMM yyyy')
                : '-'}
            </p>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Gender</Label>
            <p className=" text-sm font-medium text-neutral-500">
              {initialValue?.gender === 'male' ? 'Male' : 'Female'}
            </p>
          </div>
          {/* end: main form */}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default DetailIndividualSheet;
