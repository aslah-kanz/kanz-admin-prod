export type TContactUs = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
};

export type TContactUsPayload = {
  status: 'read' | 'replied';
};

export type TContactUsParams = {
  size?: string | undefined;
  page?: string | undefined;
  order?: string | undefined;
  sort?: string | undefined;
  search?: string | undefined;
  status?: 'unread' | 'read' | 'replied';
};
