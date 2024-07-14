import Header from '@/components/common/header/header';

export default function VendorManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" flex h-full w-full flex-col">
      <Header title="Exchange Management" />
      {children}
    </div>
  );
}
