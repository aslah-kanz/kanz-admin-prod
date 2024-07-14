import Header from '@/components/common/header/header';

export default function RefundManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" flex h-full w-full flex-col">
      <Header title="Refund Management" />
      {children}
    </div>
  );
}
