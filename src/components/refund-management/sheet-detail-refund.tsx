'use client';

import { useGetRefundById } from '@/api/refund.api';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { getBadgeVariant, slugToOriginal } from '@/utils/common.util';
import { format } from 'date-fns';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';

type TSheetDetailRefundProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refundId: string | undefined;
};

export default function SheetDetailRefund({
  open,
  setOpen,
  refundId,
}: TSheetDetailRefundProps) {
  const { data: refund, isLoading } = useGetRefundById(refundId ?? '', {
    enabled: !!refundId,
  });

  return (
    <Sheet
      // open
      open={open}
      onOpenChange={setOpen}
    >
      <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
        <SheetHeader className=" sticky top-0 gap-2 bg-white pt-4">
          <div className="flex items-center justify-between">
            <SheetTitle>
              <p className=" text-primary">View Details</p>
            </SheetTitle>
            <SheetClose>
              <FiX />
            </SheetClose>
          </div>
          <hr />
        </SheetHeader>

        {isLoading ? (
          <p>Loading</p>
        ) : (
          refund && (
            <div className=" flex flex-1 flex-col gap-4">
              {/* begin: main form */}
              <Accordion
                type="single"
                collapsible
                defaultValue="detail-information"
              >
                <AccordionItem value="detail-information">
                  <AccordionTrigger>Detail Information</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-4">
                      <div className=" flex flex-col gap-2">
                        <Label className=" text-sm">Refund ID</Label>
                        <p className=" text-sm font-medium text-neutral-500">
                          {refund.id}
                        </p>
                      </div>
                      <div className=" flex flex-col gap-2">
                        <Label className=" text-sm">Refund Date</Label>
                        <p className=" text-sm font-medium text-neutral-500">
                          {format(refund.createdAt, 'PPP')}
                        </p>
                      </div>
                      <div className=" flex flex-col gap-2">
                        <Label className=" text-sm">Status</Label>
                        <Badge variant={getBadgeVariant(refund.status)}>
                          {slugToOriginal(refund.status)}
                        </Badge>
                      </div>
                      <div className=" flex flex-col gap-2">
                        <Label className=" text-sm">Refund Reason</Label>
                        <p className=" text-sm font-medium text-neutral-500">
                          {refund.reason}
                        </p>
                      </div>
                      <div className=" flex flex-col gap-2">
                        <Label className=" text-sm">Refund Prove</Label>
                        <div className="flex flex-wrap gap-2">
                          {refund.images.map((item) => (
                            <div
                              key={item.id}
                              className=" relative aspect-square w-20 overflow-hidden rounded-md"
                            >
                              <Image
                                src={item.url}
                                fill
                                alt=""
                                className=" object-cover object-center"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="message">
                  <AccordionTrigger>Milestone Progress</AccordionTrigger>
                  <AccordionContent>
                    <div className="relative flex flex-col gap-[60px]">
                      <div className=" absolute left-4 top-1/2 z-[1] h-[calc(100%-32px)] w-px -translate-x-1/2 -translate-y-1/2 border border-dashed" />
                      <div className="z-[2] flex items-center gap-4 bg-white py-2">
                        <div className=" flex aspect-square w-8 items-center justify-center rounded-full border border-primary">
                          <div className=" aspect-square w-5 rounded-full bg-primary" />
                        </div>
                        <div className="flex flex-col">
                          <p className=" text-sm font-medium text-primary">
                            In-Transit Update
                          </p>
                          <p className=" text-xs text-neutral-500">
                            Your package is currently in transit.
                          </p>
                        </div>
                      </div>
                      <div className="z-[2] flex items-center gap-4 bg-white py-2">
                        <div className=" flex aspect-square w-8 items-center justify-center rounded-full bg-green-100">
                          <FaCheck className=" text-green-500" />
                        </div>
                        <div className="flex flex-col">
                          <p className=" text-sm font-medium text-neutral-500">
                            Exchange Shipped
                          </p>
                          <p className=" text-xs text-neutral-500">
                            Your exchange has been shipped.
                          </p>
                        </div>
                      </div>
                      <div className="z-[2] flex items-center gap-4 bg-white py-2">
                        <div className=" flex aspect-square w-8 items-center justify-center rounded-full bg-green-100">
                          <FaCheck className=" text-green-500" />
                        </div>
                        <div className="flex flex-col">
                          <p className=" text-sm font-medium text-neutral-500">
                            Exchange Confirmed
                          </p>
                          <p className=" text-xs text-neutral-500">
                            The exchange has been confirmed! It is now in
                            processing
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {/* end: main form */}
            </div>
          )
        )}
        <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
          <Button type="submit">Follow Up to Vendor</Button>
          <Button
            type="submit"
            variant="outline-primary"
          >
            Approve
          </Button>
          <Button
            type="submit"
            variant="outline-primary"
          >
            Reject
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
