import * as yup from 'yup';

export const jobFieldSchema = yup.object().shape({
  name: yup.object({
    en: yup.string().required('required').min(2, 'min2'),
    ar: yup.string(),
  }),
});

export type TJobFieldSchema = yup.InferType<typeof jobFieldSchema>;

export const jobSchema = yup.object().shape({
  title: yup.object({
    en: yup.string().required('required'),
    ar: yup.string().required('required'),
  }),
  slug: yup.string().required('required'),
  responsibility: yup.object({
    en: yup.string().required('required'),
    ar: yup.string().required('required'),
  }),
  requirement: yup.string().required('required'),
  jobType: yup.object({
    en: yup.string().required('required'),
    ar: yup.string().required('required'),
  }),
  experience: yup.object({
    en: yup.string().required('required'),
    ar: yup.string().required('required'),
  }),
  jobLocation: yup.object({
    en: yup.string().required('required'),
    ar: yup.string().required('required'),
  }),
  jobFieldId: yup.number().required('requiredJobFieldId'),
  metaDescription: yup.string(),
  metaKeyword: yup.string(),
  status: yup.string().required('required'),
});

export type TJobSchema = yup.InferType<typeof jobSchema>;
