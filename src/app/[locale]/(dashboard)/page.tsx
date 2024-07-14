'use client';

import {
  useDashboardChart,
  useDashboardSummary,
  useDashboardVendor,
} from '@/api/dashboard.api';
import { useGetOrders } from '@/api/order.api';
import Header from '@/components/common/header/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useI18n } from '@/locales/client';
import { convertToCurrency, createFullName } from '@/utils/common.util';
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  ScriptableContext,
  Title,
  Tooltip,
} from 'chart.js';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

export default function HomePage() {
  const { data: summary } = useDashboardSummary();
  const { data: chart } = useDashboardChart();
  const { data: vendor } = useDashboardVendor();
  const { data: orders } = useGetOrders();

  const options: ChartOptions<'line'> = {
    elements: {
      line: {
        tension: 0.1,
        borderJoinStyle: 'round',
      },
    },

    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 5,
        },
      },
      y: {
        border: {
          display: false,
          dash: [4, 2],
        },
      },
    },
    // responsive: false,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      title: {
        display: false,
        text: 'Monthly Sales',
      },
    },
  };

  const data: ChartData<'line'> = {
    labels: Object.keys(chart?.charts || []),
    datasets: [
      {
        fill: true,
        label: 'Total Product Sold',
        data: Object.values(chart?.charts || []),
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 2,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const { ctx } = context.chart;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(219, 234, 254, 1)');
          gradient.addColorStop(0.5, 'rgba(219, 234, 254, 0.75)');
          gradient.addColorStop(1, 'rgba(219, 234, 254, 0)');
          return gradient;
        },

        pointStyle: false,
      },
    ],
  };
  const t = useI18n();
  return (
    <div className=" relative min-h-screen w-full">
      <Header title={t('common.dashboard')} />

      <div className=" w-full p-4 lg:p-6">
        <div className=" grid grid-cols-12 items-stretch gap-4">
          {/* begin: left */}
          <div className=" col-span-12  flex  flex-col gap-4 lg:col-span-8">
            <div className="grid grid-cols-2 gap-4">
              <div className=" rounded-lg border p-4">
                <p className=" text-3xl font-medium text-neutral-800">
                  Transaction
                </p>
                <hr className=" my-4" />
                <h1 className=" text-[44px] font-semibold text-primary">
                  {convertToCurrency(summary?.total_transaction || 0)}
                </h1>
                <p className="text-sm text-neutral-500">Total Transaction</p>
              </div>
              <div className=" rounded-lg border p-4">
                <p className=" text-3xl font-medium text-neutral-800">Vendor</p>
                <hr className=" my-4" />
                <h1 className=" text-[44px] font-semibold text-primary">
                  {convertToCurrency(summary?.total_vendor || 0)}
                </h1>
                <p className="text-sm text-neutral-500">Total Summary Vendor</p>
              </div>
            </div>
            <div className=" flex flex-1 flex-col rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <p className=" text-lg font-medium text-neutral-800">
                  Transaction
                </p>
                <Link
                  href="/"
                  className=" text-sm text-primary"
                >
                  View Detail
                </Link>
              </div>

              <hr className=" my-4" />

              <div className=" relative flex h-full w-full flex-col rounded-lg border p-5">
                <div className="flex items-center justify-between">
                  <p className=" text-lg font-medium text-neutral-800">
                    Transaction History
                  </p>
                </div>
                <div className=" mt-8 grid grid-cols-3">
                  <div className="flex flex-col">
                    <h1 className=" text-3xl font-semibold text-neutral-800">
                      {convertToCurrency(chart?.total_transaction || 0)}
                    </h1>
                    <p className=" text-sm text-neutral-500">Today</p>
                  </div>
                </div>

                <div className=" relative mt-8 w-full flex-1">
                  <Line
                    options={options}
                    data={data}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* end: left */}

          {/* begin: right */}
          <div className=" col-span-12 flex flex-col gap-4 lg:col-span-4">
            <div className="flex gap-4 lg:flex-col">
              <div className=" flex w-full flex-col rounded-lg border p-4">
                <h1 className=" text-[44px] font-semibold text-primary">
                  {convertToCurrency(summary?.total_order || 0)}
                </h1>
                <p className=" text-sm text-neutral-500">Total Order</p>
              </div>
              <div className=" flex w-full flex-col rounded-lg border p-4">
                <h1 className=" text-[44px] font-semibold text-primary">
                  {convertToCurrency(summary?.on_progress_order || 0)}
                </h1>
                <p className=" text-sm text-neutral-500">On Progress Order</p>
              </div>
            </div>

            <div className=" flex flex-col rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <p className=" text-lg font-medium text-neutral-800">Vendor</p>
                <Link
                  href="/brand-management"
                  className=" text-sm text-primary"
                >
                  View Detail
                </Link>
              </div>

              <hr className=" my-4" />

              <div className="flex flex-col gap-4">
                {vendor?.map((item, i) => (
                  <div
                    key={i}
                    className=" flex items-center justify-between rounded-lg border px-3 py-5"
                  >
                    <div className="flex items-center gap-2">
                      <div className=" relative aspect-square h-[50px] overflow-hidden rounded-md">
                        <Image
                          src={item.profilePicture}
                          fill
                          alt=""
                          className=" object-contain object-center"
                        />
                      </div>
                      <p className=" text-sm font-medium text-neutral-800">
                        {createFullName(item.firstName, item.lastName)}
                      </p>
                    </div>
                    <Badge variant="blue">{item.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* end: right */}
        </div>

        <div className=" mt-8 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className=" text-lg font-medium text-neutral-800">Order</p>
            <Link
              href="/order-management"
              className=" text-sm text-primary"
            >
              View Detail
            </Link>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className=" text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.content?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  {order.grandTotal >= 0 && (
                    <TableCell className=" font-medium text-green-500">
                      SAR{order.grandTotal}
                    </TableCell>
                  )}
                  {order.grandTotal < 0 && (
                    <TableCell className=" font-medium text-red-500">
                      SAR{order.grandTotal}
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge variant="green">{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {moment(order.createdAt).format('MMM DD, yyyy')}
                  </TableCell>
                  <TableCell className=" text-right">
                    <Button variant="secondary">Download</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* begin: analytics */}

        {/* end: analytics */}
      </div>
    </div>
  );
}
