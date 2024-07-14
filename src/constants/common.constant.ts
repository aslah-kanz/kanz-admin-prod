import { TProductPropertyType } from '@/types/common.type';

export const HTTP_STATUS = {
  INITIAL: '-1',
  SUCCESS: '0',
  DUPLICATE: '30000',
  FILE_EXIST: '20102',
  DUPLICATE_SLUG: '20005',
  TOKEN_EXPIRED: '10101',
  TOKEN_INVALID: '10300',
  UNAUTHORIZED: '10000',
  NOT_FOUND: '20100',
};

export const USER_TYPE = [
  {
    type: 'admin',
    label: 'Admin',
  },
  {
    type: 'vendor',
    label: 'Vendor',
  },
  {
    type: 'manufacture',
    label: 'Manufacture',
  },
  {
    type: 'individual',
    label: 'Individual Customer',
  },
  {
    type: 'company',
    label: 'Company Customer',
  },
];

export const PAGES_MENU = [
  {
    title: {
      ar: 'معلومات عنا',
      en: 'About Us',
    },
    path: '/pages-management',
  },
  {
    title: {
      en: 'Contact Us',
      ar: 'اتصل بنا',
    },
    path: '/pages-management/contact-us',
  },
  {
    title: {
      en: 'Terms and Conditions',
      ar: 'الأحكام والشروط',
    },
    path: '/pages-management/terms-and-conditions',
  },
  {
    title: {
      en: 'Privacy Policy',
      ar: 'سياسة الخصوصية',
    },
    path: '/pages-management/privacy-policy',
  },
];

export const PRODUCT_PROPERTY_TYPE: Array<TProductPropertyType> = [
  {
    label: 'Image',
    value: 'image',
  },
  {
    label: 'Table',
    value: 'table',
  },
];

export const CONTACT_US_INDEX = {
  ADDRESS: 0,
  PHONE_NUMBER: 1,
  EMAIL: 2,
};

export const ABOUT_US_INDEX = {
  DESCRIPTION: 0,
  VISION: 1,
  MISION: 2,
  OUR_TEAM: 3,
};

export const SOCIAL_MEDIA_INDEX = {
  FACEBOOK: 1,
  TWITTER: 2,
  INSTAGRAM: 3,
  LINKEDIN: 4,
  YOUTUBE: 5,
  SNAPCHAT: 6,
  TIKTOK: 7,
  WE_CHAT: 8,
  TELEGRAM: 9,
};

export const WEBSITE_PROFILE_INDEX = {
  SITENAME: 1,
  META_DESCRIPTION: 2,
  META_KEYWORD: 3,
};
