import * as yup from 'yup';

export const paymentMethodSchema = yup.object().shape({
  name: yup.object({
    en: yup.string().required('required').min(2, 'min2'),
    ar: yup.string().required('required').min(2, 'min2'),
  }),
  instruction: yup.object({
    en: yup.string(),
    ar: yup.string(),
  }),
});

export type TPaymentMethodSchema = yup.InferType<typeof paymentMethodSchema>;
