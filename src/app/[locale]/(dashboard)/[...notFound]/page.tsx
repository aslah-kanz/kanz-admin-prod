import Header from '@/components/common/header/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

export default function NotFoundPage() {
  return (
    <div className=" flex h-full w-full flex-col items-center justify-center">
      <Header title="" />
      <h2 className=" text-lg font-medium">Not Found</h2>
      <p className=" text-sm text-neutral-500">
        Could not find requested resource
      </p>
      <Button
        asChild
        className=" mt-4"
      >
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
