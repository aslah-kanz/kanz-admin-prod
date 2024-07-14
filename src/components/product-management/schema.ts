import * as yup from 'yup';

export const PMSchema = yup.object().shape({
  name: yup.object().shape({
    en: yup.string().required('required').label('Title [en]'),
    ar: yup.string().required('required').label('Title [ar]'),
  }),
  brandId: yup.number().required('required').label('Brand'),
  storeId: yup.number(),
  mpn: yup.string().required('required').label('Mpn'),
  code: yup.string().required('required').label('Code'), // SKU
  gtin: yup.object().shape({
    ean: yup.string().required('required').label('Ean'),
    upc: yup.string().required('required').label('Upc'),
  }),
  familyCode: yup.string().required('required').label('Family Code'),
  categoryId: yup.number().required('required').label('Category'),
  description: yup.object().shape({
    en: yup.string().required('required').label('Description [en]'),
    ar: yup.string().required('required').label('Description [ar]'),
  }),
  weight: yup.number().required('required').label('Weight'),
  width: yup.number().required('required').label('Width'),
  height: yup.number().required('required').label('Height'),
  length: yup.number().required('required').label('Length'),
  metaKeyword: yup.string().required('required').label('Meta Keyword'),
  metaDescription: yup.string().required('required').label('Meta Description'),
  sellable: yup.bool().required('required').label('sellable'),
  status: yup.string().required('required').label('status'),
  comment: yup.string().label('comment'),
  galleries: yup.array().label('Galleries'),
  documents: yup.array().label('Documents'),
});

export type PMSchemaType<T extends yup.AnyObjectSchema> = yup.InferType<T>;
export type PMSchemaKeys = keyof PMSchemaType<typeof PMSchema>;
