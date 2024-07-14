import Header from '@/components/common/header/header';

export default function PurchaseManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" flex h-full w-full flex-col">
      <Header title="Purchase Management" />
      {children}
    </div>
  );
}
