'use client';

import { cn } from '@/lib/utils';
import { useScopedI18n } from '@/locales/client';
import React from 'react';
import { useFormField } from '../ui/form';

const BaseFormError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const t = useScopedI18n('validation');
  const body = error ? t(String(error?.message) as any) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-xs text-red-500 dark:text-red-900', className)}
      {...props}
    >
      {body}
    </p>
  );
});
BaseFormError.displayName = 'BaseFormError';

export default BaseFormError;
