import * as yup from 'yup';

export const attributeSchema = yup.object().shape({
  group: yup.object({
    en: yup.string().required('required').min(2, 'min2'),
    ar: yup.string(),
  }),
  name: yup.object({
    en: yup.string().required('required'),
    ar: yup.string(),
  }),
  unit1: yup.object({
    en: yup.string().required('required'),
    ar: yup.string(),
  }),
  unit2: yup.object({
    en: yup.string(),
    ar: yup.string(),
  }),
  unit3: yup.object({
    en: yup.string(),
    ar: yup.string(),
  }),
});

export type TAttributeSchema = yup.InferType<typeof attributeSchema>;
