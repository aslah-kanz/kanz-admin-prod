'use client';

import { useGetPurchaseById } from '@/api/purchase.api';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TDefaultParams } from '@/types/common.type';
import { getBadgeVariant, slugToOriginal } from '@/utils/common.util';
import { format } from 'date-fns';
import { FaSpinner } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa6';

type TPurchaseDetailPageParams = {
  params: TDefaultParams & {
    id: number;
  };
};

export default function OrderDetailPage({ params }: TPurchaseDetailPageParams) {
  const { data: purchase, isLoading } = useGetPurchaseById(params.id);
  // const [showAssign, setShowAssign] = useState(false);

  if (isLoading)
    return (
      <div className="flex h-[300px] w-full flex-col items-center justify-center gap-4">
        <FaSpinner
          size={32}
          className="animate-spin"
        />
        <div className="text-lg">Loading</div>
      </div>
    );

  if (!purchase) return <div>not found</div>;

  return (
    <>
      <div className=" w-full p-6">
        {/* begin: card */}
        <div className=" w-full rounded-lg border p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] text-neutral-500">
              <p>Purchase Management</p>
              <FaChevronRight size={12} />
              <p className=" text-primary">Purchase Detail</p>
            </div>
            {/* <Button
              size="sm"
              onClick={() => {
                toast.success('Data Downloaded', {
                  description: 'The data has been successfully downloaded',
                });
              }}
            >
              <DocumentDownload size={16} />
              Download PDF
            </Button> */}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label>Order ID</Label>
              <p className=" font-medium text-neutral-500">
                {purchase.invoice}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Date</Label>
              <p className=" font-medium text-neutral-500">
                {format(purchase.orderDate, 'PPP')}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Customer</Label>
              <p className=" font-medium text-neutral-500">{purchase.vendor}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Vendor</Label>
              <p className=" font-medium text-neutral-500">China</p>
            </div>
            <div className="col-span-2 flex flex-col gap-2">
              <Label>Address</Label>
              <p className=" font-medium text-neutral-500">
                Room 302, Building A, 123 Main Street, 510050, Guangzhou,
                Guangdong, CHINA
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Badge variant={getBadgeVariant(purchase.status)}>
                {slugToOriginal(purchase.status)}
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Total Amount</Label>
              <p className=" font-medium text-neutral-500">
                SAR {purchase.grandTotal}
              </p>
            </div>
          </div>

          <div className=" mt-6 flex flex-col gap-6">
            <p className=" text-lg font-medium text-neutral-800">
              Product List
            </p>

            <div className=" overflow-hidden rounded-lg border">
              <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                <TableHeader>
                  <TableRow className=" bg-neutral-200 [&_th]:capitalize">
                    <TableHead>Product</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchase.productList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.brand}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>SAR {item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        {/* end: card */}
        {/* <div className=" mt-6 flex gap-4">
          <Button
            variant="destructive"
            onClick={() => {
              toast.success('Purchase has been canceled');
              router.push('/purchase-management');
            }}
          >
            Cancel Order
          </Button>
          <Button onClick={() => setShowAssign((prev) => !prev)}>Assign</Button>
        </div> */}
      </div>

      {/* <Sheet
        open={showAssign}
        onOpenChange={setShowAssign}
      >
        <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
          <SheetHeader className=" sticky top-0 gap-2 bg-white pt-4">
            <div className="flex items-center justify-between">
              <SheetTitle>
                <div className="flex items-center gap-2">
                  <UserEdit size={24} />
                  Assign
                </div>
              </SheetTitle>
              <SheetClose>
                <FiX />
              </SheetClose>
            </div>
            <hr />
          </SheetHeader>

          <div className=" flex flex-col gap-2">
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Choose Vendor</Label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select Vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Vendor 1</SelectItem>
                  <SelectItem value="dark">Vendor XYZ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
            <Button
              onClick={() => {
                setShowAssign((prev) => !prev);
                toast.success('Purchase has been assigned');
              }}
            >
              Assign to Vendor
            </Button>
          </div>
        </SheetContent>
      </Sheet> */}
    </>
  );
}
