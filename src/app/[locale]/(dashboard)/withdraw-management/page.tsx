'use client';

import { useGetWithdraws } from '@/api/withdraw.api';
import BasePagination from '@/components/common/base-pagination';
import BaseSearch from '@/components/common/base-search';
import BaseTableSkeleton from '@/components/common/base-table-skeleton';
import EmptyState from '@/components/common/empty-state';
import Header from '@/components/common/header/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  createFullName,
  getBadgeVariant,
  slugToOriginal,
} from '@/utils/common.util';
import { format } from 'date-fns';
import { Bank, CloudPlus, Eye, EyeSlash, Warning2 } from 'iconsax-react';
import { useState } from 'react';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';
import { toast } from 'sonner';

export default function WithdrawPage() {
  // state
  const [isOpenWd, setIsOpenWd] = useState<boolean>(false);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [showVerify, setShowVerify] = useState<boolean>(false);
  const [showWdRequest, setShowWdRequest] = useState<boolean>(false);

  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  const { data: withdraws, isLoading: loadingGets } = useGetWithdraws();

  return (
    <>
      <div className=" w-full">
        <Header title="Withdraw" />

        <div className=" w-full p-6">
          <div className=" w-full rounded-lg border p-5">
            {/* begin: filter, search and action */}
            <div className=" flex w-full justify-between rounded-lg bg-neutral-100 p-2">
              <Button
                variant="transparent"
                className=" text-xs"
                onClick={() =>
                  toast.success('Data downloaded', {
                    description: 'The data has been successfully downloaded',
                  })
                }
              >
                <CloudPlus size={16} />
                Download Data
              </Button>
              <BaseSearch className=" hidden lg:block" />
            </div>
            <BaseSearch className=" mt-2 block lg:hidden" />
            {/* begin: filter, search and action */}

            {loadingGets ? (
              <BaseTableSkeleton />
            ) : withdraws && withdraws.totalCount > 0 ? (
              <>
                <div className=" mt-4 overflow-hidden rounded-lg border">
                  <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                    <TableHeader>
                      <TableRow className=" bg-neutral-200 [&_th]:capitalize">
                        <TableHead>Date Withdraw</TableHead>
                        <TableHead>Customer</TableHead>
                        {/* <TableHead>Vendor Account Bank</TableHead> */}
                        <TableHead>Total Withdraw</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdraws.content.map((withdraw) => (
                        <TableRow key={withdraw.id}>
                          <TableCell>{format(withdraw.date, 'PPP')}</TableCell>

                          <TableCell>
                            {createFullName(
                              withdraw.principal.firstName,
                              withdraw.principal.lastName,
                            )}
                          </TableCell>

                          <TableCell>SAR {withdraw.amount}</TableCell>
                          <TableCell>
                            <Badge
                              variant={getBadgeVariant(withdraw.status)}
                              size="lg"
                            >
                              {slugToOriginal(withdraw.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost-primary"
                              className=" font-medium"
                              onClick={() => setIsOpenDetail((prev) => !prev)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* end: table */}
                <BasePagination totalCount={25} />
              </>
            ) : (
              <EmptyState />
            )}

            {/* begin: table */}
          </div>
        </div>
      </div>

      {/* begin: dialog verify */}
      <Dialog
        open={showVerify}
        onOpenChange={(open) => setShowVerify(open)}
      >
        <DialogContent className=" max-w-[414px]">
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
                To verify and proceed withdraw, please enter your password
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
                  placeholder="Enter your password"
                  type={isShowPassword ? 'text' : 'password'}
                />
              </div>
              <div className=" mt-4 flex w-full gap-4">
                <DialogClose asChild>
                  <Button
                    variant="secondary"
                    className=" w-full"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  className=" w-full"
                  onClick={() => {
                    setShowVerify((prev) => !prev);
                    setShowWdRequest((prev) => !prev);
                  }}
                >
                  Yes
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* end: dialog verify */}

      {/* begin: dialog withdraw request */}
      <Dialog
        open={showWdRequest}
        onOpenChange={(open) => setShowWdRequest(open)}
      >
        <DialogContent className=" max-w-[414px] px-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className=" rounded-full bg-green-200 p-2">
              <FaRegCircleCheck
                className=" text-green-500"
                size={20}
              />
            </div>

            <div className=" space-y-1 text-center">
              <p className=" font-medium text-neutral-800">
                Withdraw request sent
              </p>
              <p className=" text-center text-sm text-neutral-500">
                Your withdrawal request has been sent and will be processed by
                kanzway admin.
              </p>
            </div>
            <Button
              className=" w-full"
              onClick={() => setShowWdRequest((prev) => !prev)}
            >
              Ok
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* end: dialog withdraw request */}

      {/* begin: drawer withdraw detail */}
      <Sheet
        open={isOpenDetail}
        onOpenChange={setIsOpenDetail}
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
            <div className=" space-y-1">
              <p className=" font-medium text-neutral-800">Date Withdraw</p>
              <p className=" text-sm text-neutral-500">20 February 2024</p>
            </div>
            <div className=" space-y-1">
              <p className=" font-medium text-neutral-800">Amount</p>
              <p className=" text-sm text-neutral-500">$2,400</p>
            </div>
            <div className=" space-y-1">
              <p className=" font-medium text-neutral-800">Customer</p>
              <p className=" text-sm text-neutral-500">Jhon Doe</p>
            </div>
            {/* <div className=" space-y-1">
              <p className=" font-medium text-neutral-800">Total Withdraw</p>
              <p className=" text-sm text-neutral-500">XYZ Bank</p>
            </div> */}
            <div className=" space-y-1">
              <p className=" font-medium text-neutral-800">Status</p>
              <Badge
                variant="green"
                size="lg"
              >
                Success
              </Badge>
            </div>
          </div>

          <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
            <Button
              onClick={() => {
                setIsOpenDetail((prev) => !prev);
                toast.success('Status successfully updated');
              }}
            >
              Update Status
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      {/* end: drawer withdraw detail */}

      {/* begin: drawer create withdraw */}
      <Sheet
        open={isOpenWd}
        onOpenChange={(open) => setIsOpenWd(open)}
      >
        <SheetContent className=" flex flex-col p-0">
          <SheetHeader className=" gap-2 px-5 py-6 pb-0">
            <div className="flex items-center justify-between">
              <SheetTitle>Create Withdraw</SheetTitle>
              <SheetClose>
                <FiX />
              </SheetClose>
            </div>
            <hr />
          </SheetHeader>

          <div className=" flex flex-1 flex-col overflow-y-auto p-5 pt-0">
            <div className="">
              <p className=" font-medium">Your Amount</p>
              <div className=" mt-2 w-fit rounded-lg border border-dashed px-6 py-2.5">
                <h1 className=" text-2xl font-medium">$6,840</h1>
                <p className=" text-sm text-neutral-500">Net Income</p>
              </div>
            </div>

            <div className=" mt-4 flex flex-col gap-2">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Amount
              </label>
              <Input
                className=" w-full rounded-lg border"
                placeholder="Input amount"
              />
              <p className=" text-xs text-neutral-500">
                Min. withdraw amount $5
              </p>
            </div>

            <div className=" mt-4 flex flex-col">
              <h1 className=" font-medium">Withdraw Method</h1>
              <div className="my-2 mb-4 flex flex-col">
                <div className=" flex items-center">
                  <label
                    htmlFor="bank"
                    className="flex flex-1 items-center gap-4"
                  >
                    <Bank size={32} />
                    <div className="flex flex-col">
                      <p className=" text-sm">XYZ transfer bank</p>
                      <p className=" text-xs text-neutral-500">
                        123456789 • John Doe
                      </p>
                    </div>
                  </label>
                  <input
                    type="radio"
                    name=""
                    id="bank"
                    className=" accent-primary"
                  />
                </div>
              </div>
              <p className=" text-xs text-neutral-500">
                Your transaction is secure. Kanzway employs advanced encryption
                to protect your financial information.
              </p>
            </div>

            <div className=" mt-4 w-full">
              <Button
                className=" w-full"
                onClick={() => {
                  setIsOpenWd((prev) => !prev);
                  setShowVerify((prev) => !prev);
                }}
              >
                Request Withdraw
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      {/* end: drawer create withdraw */}
    </>
  );
}
