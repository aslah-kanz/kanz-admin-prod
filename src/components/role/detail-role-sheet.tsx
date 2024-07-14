import { useGetPrivilage, useGetRoleById } from '@/api/role.api';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import useDetailRoleSheetStore from '@/store/detail-role-sheet.store';
import { FiX } from 'react-icons/fi';

function DetaiRoleSheet() {
  const {
    isOpen: isDetailOpen,
    onChangeOpen: openDetailRole,
    initialValue,
  } = useDetailRoleSheetStore();

  const { data: priviladgeList } = useGetPrivilage();
  const { data: detailRole } = useGetRoleById(initialValue?.id!);

  // const FAKE_DETAIL_ROLE: TRoleDetail = {
  //   id: 1,
  //   name: 'Super Admin',
  //   type: 'admin',
  //   status: 'active',
  //   privilages: [
  //     {
  //       id: 1,
  //       name: 'Dashboard',
  //     },
  //     {
  //       id: 2,
  //       name: 'Role',
  //     },
  //   ],
  // };

  // console.log('checkFilter', priviladgeList);
  // console.log(
  //   'checkFilter',
  //   priviladgeList?.filter((items) =>
  //     detailRole?.privilegeIds?.includes(items.id),
  //   ),
  // );

  return (
    <Sheet
      // open
      open={isDetailOpen}
      onOpenChange={(open) => openDetailRole(open)}
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
            <p className=" text-sm font-medium text-neutral-500">
              {detailRole?.name}
            </p>
          </div>
          <div className=" relative flex w-full flex-col gap-2">
            <Label className=" text-sm">Permission Menu</Label>
            <div className="flex flex-wrap gap-2">
              {priviladgeList
                ?.filter((items) =>
                  detailRole?.privilegeIds?.includes(items.id),
                )
                .map((items) => (
                  <Badge
                    key={Math.random()}
                    variant="blue"
                  >
                    {items.name}
                  </Badge>
                ))}
            </div>
          </div>
          {/* <div className=" flex flex-col gap-2">
                        <Label className=" text-sm">Status</Label>
                        <Badge variant="green">{detailRole.status}</Badge>
                    </div> */}
          {/* end: main form */}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default DetaiRoleSheet;
