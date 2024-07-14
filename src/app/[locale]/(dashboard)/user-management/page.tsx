'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TabAdmin from '@/components/user-management/tab-admin';
import TabCompany from '@/components/user-management/tab-company';
import TabIndividual from '@/components/user-management/tab-individual';
import TabManufacture from '@/components/user-management/tab-manufacture';
import TabVendor from '@/components/user-management/tab-vendor';
import { USER_TYPE } from '@/constants/common.constant';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';

type TUserManagementPageParams = {
  searchParams: {
    type: string | undefined;
  };
};

export default function UserManagementPage({
  searchParams,
}: TUserManagementPageParams) {
  const type = searchParams.type || 'admin';

  const queryClient = useQueryClient();
  const router = useRouter();

  const tabClicked = () => {
    queryClient.invalidateQueries({ queryKey: ['getPrincipalList'] });
    queryClient.invalidateQueries({ queryKey: ['getPrincipalById'] });
    queryClient.removeQueries({ queryKey: ['getPrincipalList'] });
    queryClient.removeQueries({ queryKey: ['getPrincipalById'] });
    router.refresh();
  };

  return (
    <div className=" flex h-full w-full flex-col p-6">
      <div className=" w-full rounded-lg border p-4 pt-2">
        <Tabs
          defaultValue={type}
          className=""
        >
          <TabsList className=" gap-8 bg-transparent">
            {USER_TYPE.map((userType) => (
              <TabsTrigger
                key={userType.type}
                value={userType.type}
                className=" h-10 w-full max-w-[300px] rounded-none border-b-2 border-transparent px-0 text-base data-[state=active]:border-primary"
                asChild
              >
                <Link
                  href={`/user-management?type=${userType.type}`}
                  onClick={() => tabClicked()}
                >
                  {userType.label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value="admin"
            className=" mt-6"
          >
            <TabAdmin />
          </TabsContent>
          <TabsContent
            value="vendor"
            className=" mt-6"
          >
            <TabVendor />
          </TabsContent>
          <TabsContent
            value="manufacture"
            className=" mt-6"
          >
            <TabManufacture />
          </TabsContent>
          <TabsContent
            value="individual"
            className=" mt-6"
          >
            <TabIndividual />
          </TabsContent>
          <TabsContent
            value="company"
            className=" mt-6"
          >
            <TabCompany />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
