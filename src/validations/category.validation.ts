import * as yup from 'yup';

export enum CATEGORY_STATUS {
  draft = 'draft',
  ignored = 'ignored',
  published = 'published',
}

export type TStatus = 'draft' | 'ignored' | 'published';

export const categorySchema = yup.object().shape({
  parentId: yup.number().required('requiredParentId'),
  code: yup.string().max(8, 'max8').required('required'),
  name: yup.object({
    en: yup.string().required('required').min(2, 'min2').label('Name'),
    ar: yup.string().required('required'),
  }),
  slug: yup.string().required('required').max(100, 'max100').min(1, 'min1'),
  imageId: yup.number(),
  description: yup.object({
    en: yup.string().required('required'),
    ar: yup.string().required('required'),
  }),
  metaDescription: yup.string().max(160, 'max160').required('required'),
  metaKeyword: yup.string().max(65, 'max65').required('required'),
  showAtHomePage: yup.boolean().required(),
  status: yup.string().required('required').label('status'),
});

export type TCategorySchema = yup.InferType<typeof categorySchema>;
