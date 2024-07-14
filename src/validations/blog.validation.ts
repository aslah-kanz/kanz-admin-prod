import * as yup from 'yup';

export const blogSchema = yup.object().shape({
  code: yup.string(),
  title: yup.object({
    en: yup.string().required('required').min(2, 'min2'),
    ar: yup.string().required('required'),
  }),
  description: yup.object({
    en: yup.string().required('required').min(2, 'min2'),
    ar: yup.string(),
  }),
  slug: yup.string().required('required'),
  metaDescription: yup.string().max(160, 'max160'),
  metaKeyword: yup.string().max(65, 'max65'),
  imageId: yup.number().required('required'),
});

export type TBlogSchema = yup.InferType<typeof blogSchema>;
