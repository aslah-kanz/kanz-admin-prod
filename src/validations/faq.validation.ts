import * as yup from 'yup';

export const faqGroupSchema = yup.object().shape({
  title: yup.object({
    en: yup.string().required('required').min(2, 'min2'),
    ar: yup.string().required('required').min(2, 'min2'),
  }),
  description: yup.object({
    en: yup.string().min(2, 'min2'),
    ar: yup.string(),
  }),
  showAtHomePage: yup.boolean().required('required'),
  status: yup.string().required('required'),
});

export type TFaqGroupSchema = yup.InferType<typeof faqGroupSchema>;

export const faqSchema = yup.object().shape({
  faqGroupId: yup.number().required('requiredFaqGroupId'),
  question: yup.object({
    en: yup.string().required('required').min(2, 'min2'),
    ar: yup.string(),
  }),
  answer: yup.object({
    en: yup.string().min(2, 'min2'),
    ar: yup.string(),
  }),
  status: yup.string().required('required'),
});

export type TFaqSchema = yup.InferType<typeof faqSchema>;
