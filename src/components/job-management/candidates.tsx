'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import useLangClient from '@/hooks/use-lang-client';
import { useI18n } from '@/locales/client';
import useSheetDetailApplicantStore from '@/store/job-management/sheet-detail-applicant.store';
import { TApplicant } from '@/types/job.type';
import { getBadgeVariant, transformStatus } from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import { format, compareAsc } from 'date-fns';
import { Warning2 } from 'iconsax-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import BaseTableSkeleton from '../common/base-table-skeleton';
import EmptyState from '../common/empty-state';
import SheetDetailApplicant from './sheet-detail-applicant';

type TCandidatesProps = {
  applicants: TApplicant[] | undefined;
  isLoading: boolean;
};

export default function Candidates({
  applicants,
  isLoading,
}: TCandidatesProps) {
  const TAB_LIST = [
    {
      title: {
        en: 'Processed',
        ar: 'طلب',
      },
      slug: 'processed',
    },
    {
      title: {
        en: 'Rejected',
        ar: 'تمت معالجتها',
      },
      slug: 'rejected',
    },
    {
      title: {
        ar: 'مكتمل',
        en: 'Approved',
      },
      slug: 'approved',
    },
  ];

  const { isAr } = useLangClient();
  const t = useI18n();
  const params = useParams();
  const pathname = usePathname();

  const [_showDetail, _setShowDetail] = useState<boolean>(false);
  const [showReject, setShowReject] = useState<boolean>(false);

  // store
  const { onOpen, setApplicant } = useSheetDetailApplicantStore();

  applicants?.sort((a, b) =>
    compareAsc(new Date(b.applyDate), new Date(a.applyDate)),
  );

  return (
    <>
      <div className=" mt-6 flex flex-col gap-6">
        <p className=" text-lg font-medium text-neutral-800">
          {t('job.candidates')}
        </p>

        <Tabs
          defaultValue="processed"
          className=""
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <TabsList className=" gap-8 bg-transparent">
            {TAB_LIST.map((tab) => (
              <TabsTrigger
                key={tab.slug}
                value={tab.slug}
                className=" h-10 w-full max-w-[300px] rounded-none border-b-2 border-transparent px-0 data-[state=active]:border-primary"
                asChild
              >
                <Link
                  href={pathname}
                  scroll={false}
                >
                  {getLang(params, tab.title)}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent
            value="processed"
            className=" mt-4"
          >
            {isLoading ? (
              <BaseTableSkeleton />
            ) : applicants && applicants.length > 0 ? (
              <>
                <div className=" overflow-hidden rounded-lg border">
                  <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                    <TableHeader>
                      <TableRow className=" bg-neutral-200 [&_th]:capitalize">
                        <TableHead>{t('job.candidateName')}</TableHead>
                        <TableHead>{t('job.dateApplied')}</TableHead>
                        <TableHead>{t('common.status')}</TableHead>
                        <TableHead>{t('common.action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applicants
                        .filter(
                          (applicant) =>
                            !['approved', 'rejected'].includes(
                              applicant.status,
                            ),
                        )
                        .map((applicant) => (
                          <TableRow key={applicant.id}>
                            <TableCell>{applicant.name}</TableCell>
                            <TableCell>
                              {format(
                                applicant.applyDate,
                                'dd MMM yyyy HH:mm:SS',
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getBadgeVariant(applicant.status)}
                                size="lg"
                              >
                                {transformStatus(applicant.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => {
                                  setApplicant(applicant);
                                  onOpen();
                                }}
                              >
                                {t('common.viewDetails')}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                {/* <BasePagination totalCount={applicants.length} /> */}
              </>
            ) : (
              <EmptyState />
            )}
          </TabsContent>
          <TabsContent
            value="rejected"
            className=" mt-4"
          >
            {isLoading ? (
              <BaseTableSkeleton />
            ) : applicants && applicants.length > 0 ? (
              <>
                <div className=" overflow-hidden rounded-lg border">
                  <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                    <TableHeader>
                      <TableRow className=" bg-neutral-200 [&_th]:capitalize">
                        <TableHead>{t('job.candidateName')}</TableHead>
                        <TableHead>{t('job.dateApplied')}</TableHead>
                        <TableHead>{t('common.status')}</TableHead>
                        <TableHead>{t('common.action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applicants
                        .filter((applicant) => applicant.status === 'rejected')
                        .map((applicant) => (
                          <TableRow key={applicant.id}>
                            <TableCell>{applicant.name} </TableCell>
                            <TableCell>
                              {format(
                                applicant.applyDate,
                                'dd MMM yyyy HH:mm:SS',
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getBadgeVariant(applicant.status)}
                                size="lg"
                              >
                                {transformStatus(applicant.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => {
                                  setApplicant(applicant);
                                  onOpen();
                                }}
                              >
                                {t('common.viewDetails')}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                {/* <BasePagination totalCount={applicants.length} /> */}
              </>
            ) : (
              <EmptyState />
            )}
          </TabsContent>
          <TabsContent
            value="approved"
            className=" mt-4"
          >
            {isLoading ? (
              <BaseTableSkeleton />
            ) : applicants && applicants.length > 0 ? (
              <>
                <div className=" overflow-hidden rounded-lg border">
                  <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                    <TableHeader>
                      <TableRow className=" bg-neutral-200 [&_th]:capitalize">
                        <TableHead>{t('job.candidateName')}</TableHead>
                        <TableHead>{t('job.dateApplied')}</TableHead>
                        <TableHead>{t('common.status')}</TableHead>
                        <TableHead>{t('common.action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applicants
                        .filter((applicant) => applicant.status === 'approved')
                        .map((applicant) => (
                          <TableRow key={applicant.id}>
                            <TableCell>{applicant.name}</TableCell>
                            <TableCell>
                              {format(
                                applicant.applyDate,
                                'dd MMM yyyy HH:mm:SS',
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getBadgeVariant(applicant.status)}
                                size="lg"
                              >
                                {transformStatus(applicant.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => {
                                  setApplicant(applicant);
                                  onOpen();
                                }}
                              >
                                {t('common.viewDetails')}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                {/* <BasePagination totalCount={applicants.length} /> */}
              </>
            ) : (
              <EmptyState />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* begin: drawer detail company customer */}

      <SheetDetailApplicant />

      {/* end: drawer detail company customer */}

      {/* begin: dialog reject */}
      <Dialog
        open={showReject}
        onOpenChange={setShowReject}
      >
        <DialogContent className=" max-w-xl p-0">
          <div className="flex flex-col p-16">
            <div className=" flex flex-col items-center gap-2 text-center">
              <Warning2
                size={64}
                className=" text-yellow-500"
                variant="Bold"
              />
              <h1 className=" text-lg font-medium text-neutral-800">
                Reject Confirmation
              </h1>
              <p className=" text-sm text-neutral-500">
                Are you sure you want to reject this product? Please provide the
                reason for rejecting the product:
              </p>
            </div>

            <div className=" mt-8">
              <div className="flex flex-col gap-4">
                <Label className=" text-sm font-normal">Rejection Reason</Label>
                <Textarea placeholder="Input Rejection Reason" />
              </div>
            </div>
          </div>
          <div className=" flex justify-end gap-4 border-t px-6 py-4">
            <DialogClose asChild>
              <Button
                className=" text-primary"
                variant="ghost"
              >
                Close
              </Button>
            </DialogClose>
            <Button>Reject</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* end: dialog reject */}
    </>
  );
}
