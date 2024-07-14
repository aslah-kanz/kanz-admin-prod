import Header from '@/components/common/header/header';

export default function ProductManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" flex h-full w-full flex-col">
      <Header title="Product Management" />
      {children}
    </div>
  );
}
