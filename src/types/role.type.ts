export type TRole = {
  id: number;
  name: string;
  type?: string;
  privilageMenu?: number;
  status?: string;
};

export type TRoleDetail = {
  id: number;
  name: string;
  type?: string;
  privilegeIds: number[];
  status?: string;
};

export type TRoleAdd = {
  name: string;
  status?: string;
  privilegeIds: number[];
};

export type TPrivilage = {
  id: number;
  name: string;
};
