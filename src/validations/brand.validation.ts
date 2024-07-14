import * as yup from 'yup';

export const brandSchema = yup.object().shape({
  code: yup.string().required('required'),
  name: yup.object({
    en: yup.string().required('required').min(2, 'min2'),
    ar: yup.string().required('required'),
  }),
  slug: yup.string().required('required'),
  imageId: yup.number().required('required'),
  bwImageId: yup.number(),
  description: yup.object({
    en: yup.string().required('required'),
    ar: yup.string().required('required'),
  }),
  metaDescription: yup.string().required('required').max(160, 'max160'),
  metaKeyword: yup.string().required('required').max(65, 'max65'),
  showAtHomePage: yup.boolean().required('required'),
  status: yup.string().required('required'),
  categoryIds: yup
    .array()
    .of(yup.number().required('required'))
    .required()
    .min(1, 'min1items'),
});

export type TBrandSchema = yup.InferType<typeof brandSchema>;
