'use client';

import { useApproveApplicant, useRejectApplicant } from '@/api/job.api';
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
import { HTTP_STATUS } from '@/constants/common.constant';
import { useI18n } from '@/locales/client';
import useSheetDetailApplicantStore from '@/store/job-management/sheet-detail-applicant.store';
import { getBadgeVariant, transformStatus } from '@/utils/common.util';
import { format } from 'date-fns';
import { CloudPlus } from 'iconsax-react';
import Link from 'next/link';
import { useCallback } from 'react';
import { FiX } from 'react-icons/fi';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function SheetDetailApplicant() {
  const t = useI18n();
  const queryClient = useQueryClient();

  // store
  const { isOpen, toggle, applicant } = useSheetDetailApplicantStore();

  const { mutate: reject, isLoading: loadingReject } = useRejectApplicant({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success rejected applicant');
        queryClient.invalidateQueries({ queryKey: ['job-applicants'] });
        toggle();
      } else {
        toast.error('Failed rejected applicant', { description: resp.message });
      }
    },
  });
  const { mutate: approve, isLoading: loadingApprove } = useApproveApplicant({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success approved applicant');
        queryClient.invalidateQueries({ queryKey: ['job-applicants'] });
        toggle();
      } else {
        toast.error('Failed approved applicant', { description: resp.message });
      }
    },
  });

  const handleReject = useCallback(() => {
    if (applicant) {
      reject(applicant.id);
    }
  }, [applicant, reject]);

  const handleApprove = useCallback(() => {
    if (applicant) {
      approve(applicant.id);
    }
  }, [applicant, approve]);

  return (
    applicant && (
      <Sheet
        open={isOpen}
        onOpenChange={toggle}
      >
        <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
          <SheetHeader className=" sticky top-0 gap-2 bg-white pt-4">
            <div className="flex items-center justify-between">
              <SheetTitle>{t('common.viewDetails')}</SheetTitle>
              <SheetClose>
                <FiX />
              </SheetClose>
            </div>
            <hr />
          </SheetHeader>

          <div className=" flex flex-col gap-4">
            {/* begin: main form */}
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('job.candidateName')}</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {applicant.name}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('job.dateApplied')}</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {format(applicant.applyDate, 'dd MMM yyyy HH:mm:SS')}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.email')}</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {applicant.email}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.phoneNumber')}</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {applicant.phoneNumber}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.address')}</Label>
              <p className=" text-sm font-medium text-neutral-500">
                Riyadh <strong>API</strong>
              </p>
            </div>
            <div className=" flex flex-col items-start gap-2">
              <Label className=" text-sm">{t('common.status')}</Label>
              <Badge
                variant={getBadgeVariant(applicant.status)}
                size="lg"
              >
                {transformStatus(applicant.status)}
              </Badge>
            </div>
            {applicant.document && (
              <div className=" flex flex-col items-start gap-2">
                <Label className=" text-sm">{t('job.cv')}</Label>
                <Button
                  variant="ghost-primary"
                  size="sm"
                  asChild
                >
                  <Link
                    href={applicant.document?.url}
                    download
                    target="_blank"
                  >
                    <CloudPlus size={16} />
                    {t('job.downloadCV')}
                  </Link>
                </Button>
              </div>
            )}
            {/* end: main form */}
          </div>

          {!['approved', 'rejected'].includes(applicant.status) && (
            <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
              <Button
                onClick={handleApprove}
                className=" gap-2"
                disabled={loadingApprove}
              >
                {loadingApprove && (
                  <LuLoader2
                    className=" animate-spin text-white"
                    size={16}
                  />
                )}
                {t('common.approve')}
              </Button>
              <Button
                onClick={handleReject}
                className=" gap-2 text-primary"
                variant="ghost"
                disabled={loadingReject}
              >
                {loadingReject && (
                  <LuLoader2
                    className=" animate-spin text-white"
                    size={16}
                  />
                )}
                {t('common.reject')}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    )
  );
}
