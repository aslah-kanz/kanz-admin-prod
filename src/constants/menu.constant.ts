import { TSidebarMenu } from '@/types/common.type';
import {
  ArrangeHorizontalSquare,
  Award,
  Book,
  Box1,
  Briefcase,
  CardReceive,
  CardSend,
  Category,
  DollarSquare,
  Edit,
  Element4,
  GlobalEdit,
  Home2,
  Information,
  MenuBoard,
  Message,
  People,
  Setting3,
  ShoppingCart,
  Tag,
  TruckFast,
  UserEdit,
  Wallet1,
} from 'iconsax-react';

export const SIDEBAR_MENU: TSidebarMenu[] = [
  {
    title: {
      en: 'Dashboard',
      ar: 'لوحة القيادة',
    },
    href: '/',
    icon: Home2,
  },
  {
    title: {
      en: 'Role Management',
      ar: 'إدارة الأدوار',
    },
    href: '/role-management',
    icon: UserEdit,
  },
  {
    title: {
      en: 'User Management',
      ar: 'إدارةالمستخدم',
    },
    href: '/user-management',
    icon: People,
  },
  {
    title: {
      en: 'Product Category',
      ar: 'فئة المنتج',
    },
    href: '/product-category',
    icon: Category,
  },
  {
    title: {
      en: 'Brand Management',
      ar: 'إدارة العلامات التجارية',
    },
    href: '/brand-management',
    icon: Tag,
  },
  {
    title: {
      en: 'Product Management',
      ar: 'ادارة المنتج',
    },
    href: '/product-management',
    icon: Box1,
  },
  {
    title: {
      en: 'Attribute Management',
      ar: 'إدارة السمات',
    },
    href: '/attribute-management',
    icon: Setting3,
  },
  {
    title: {
      en: 'Order Management',
      ar: 'إدارة الطلبات',
    },
    href: '/order-management',
    icon: Book,
  },
  {
    title: {
      en: 'Purchase Management',
      ar: 'إدارة شراء',
    },
    href: '/purchase-management',
    icon: ShoppingCart,
  },
  {
    title: {
      en: 'Exchange Management',
      ar: 'إدارة الصرف',
    },
    href: '/exchange-management',
    icon: ArrangeHorizontalSquare,
  },
  {
    title: {
      en: 'Refund Management',
      ar: 'إدارة استرداد الأموال',
    },
    href: '/refund-management',
    icon: CardSend,
  },
  {
    title: {
      en: 'Withdraw Management',
      ar: 'إدارة السحب',
    },
    href: '/withdraw-management',
    icon: CardReceive,
  },
  {
    title: {
      en: 'Pages Management',
      ar: 'إدارة الصفحات',
    },
    href: '/pages-management',
    icon: Element4,
  },
  {
    title: {
      en: 'Setting Website',
      ar: 'إعداد موقع الويب',
    },
    href: '/setting-website',
    icon: GlobalEdit,
  },
  {
    title: {
      en: 'Banner Management',
      ar: 'إدارة البانر',
    },
    href: '/banner-management',
    icon: DollarSquare,
  },
  {
    title: {
      en: 'Blog Management',
      ar: 'إدارة المدونة',
    },
    href: '/blog-management',
    icon: Edit,
  },
  {
    title: {
      en: 'FAQ Management',
      ar: 'إدارة الأسئلة الشائعة',
    },
    href: '/faq-management',
    icon: Information,
  },
  {
    title: {
      en: 'Contact US',
      ar: 'اتصل بنا',
    },
    href: '/contact-us',
    icon: Message,
  },
  {
    title: {
      en: 'Job Management',
      ar: 'إدارة الوظائف',
    },
    href: '/job-management',
    icon: Briefcase,
  },
  {
    title: {
      en: 'Catalogue Management',
      ar: 'إدارة الكتالوج',
    },
    href: '/catalogue-management',
    icon: MenuBoard,
  },
  {
    title: {
      en: 'Certification Management',
      ar: 'إدارة الشهادات',
    },
    href: '/certification-management',
    icon: Award,
  },
  {
    title: {
      en: 'Shipping Method',
      ar: 'طريقة الشحن',
    },
    href: '/shipping-method',
    icon: TruckFast,
  },
  {
    title: {
      en: 'Payment Method',
      ar: 'طريقة الدفع او السداد',
    },
    href: '/payment-method',
    icon: Wallet1,
  },
  // {
  //   title: {
  //     en: 'Notification',
  //     ar: 'ينسحب',
  //   },
  //   href: '/notification',
  //   icon: Notification,
  // },
];
