import * as yup from 'yup';

export const countrySchema = yup.object().shape({
  code: yup.string().required('required').min(2, 'min2'),
  name: yup.object({
    en: yup.string().required('required').min(2, 'min2'),
    ar: yup.string(),
  }),
  phoneCode: yup.number().required('required'),
  phoneStartNumber: yup.number().required('required'),
  phoneMinLength: yup.number().required('required'),
  phoneMaxLength: yup.number().required('required'),
  imageId: yup.number().required('required'),
});

export type TCountrySchema = yup.InferType<typeof countrySchema>;
