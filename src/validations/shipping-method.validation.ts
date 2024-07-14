import * as yup from 'yup';

export const shippingMethodSchema = yup.object().shape({
  providerName: yup.string().required('required'),
  deliveryCompanyName: yup.string().required('required'),
  deliveryEstimateTime: yup.string().required('required'),
});

export type TShippingMethodSchema = yup.InferType<typeof shippingMethodSchema>;
