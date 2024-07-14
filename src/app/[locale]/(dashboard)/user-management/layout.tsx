import Header from '@/components/common/header/header';

export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" flex h-full w-full flex-col">
      <Header title="User Management" />
      {children}
    </div>
  );
}
