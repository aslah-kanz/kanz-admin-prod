import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useModalAddBankStore from '@/store/modal-add-bank.store';
import { FiX } from 'react-icons/fi';
import * as yup from 'yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { TBankAdd } from '@/types/bank.type';
import { useAddBank, useEditBank } from '@/api/bank.api';
import { HTTP_STATUS } from '@/constants/common.constant';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import { useUploadDocument } from '@/api/documents.api';

const schema = yup.object().shape({
  // Handling for phone number validation
  currencyId: yup.string().required('required').label('Curency ID'),
  documentId: yup.number().required('required').label('Document ID'),
  paymentMode: yup.string().required('required').label('Payment Mode'),
  name: yup.string().required('required').label('Name'),
  beneficiaryName: yup.string().required('required').label('Beneficiary Name'),
  city: yup.string().required('required').label('City'),
  accountNumber: yup.string().required('required').label('Account Number'),
  iban: yup.string().required('required').label('iban'),
  swiftCode: yup.string().required('required').label('Swift Code'),
  file: yup.mixed<File>(),
});

function SheetAddBank() {
  const [fileName, setFileName] = useState('');

  const { isOpen, initialValue, onChangeOpen } = useModalAddBankStore();

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    // reset,
    // resetField,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      currencyId: '',
      documentId: 0,
      paymentMode: '',
      name: '',
      beneficiaryName: '',
      city: '',
      accountNumber: '',
      iban: '',
      swiftCode: '',
      file: undefined,
    },
  });

  const wchCurrency = watch('currencyId');

  const onSelectCurrency = (value: string) => {
    setValue('currencyId', value);
  };

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleTriggerFileChange = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: uploadDocument, isLoading: loadingUpload } =
    useUploadDocument();
  const { mutate: addBank, isLoading: loading } = useAddBank({
    onSuccess: (resp) => {
      // console.log('checkResp_2', resp);
      if (resp.code === HTTP_STATUS.SUCCESS) {
        queryClient.invalidateQueries({
          queryKey: ['getAllBank'],
        });
        onChangeOpen(!isOpen);
        toast.success('Bank Added Successfully');
        router.push('/profile/bank-account');
        router.refresh();
      } else {
        toast.error(resp.message);
      }
    },
  });
  const { mutate: editBank, isLoading: loadingEdit } = useEditBank({
    onSuccess: (resp) => {
      // console.log('checkResp_2', resp);
      if (resp.code === HTTP_STATUS.SUCCESS) {
        queryClient.invalidateQueries({
          queryKey: ['getAllBank'],
        });
        onChangeOpen(!isOpen);
        toast.success('Bank Edited');
        router.push('/profile/bank-account');
        router.refresh();
      } else {
        toast.error(resp.message);
      }
    },
  });

  const handleActualSubmit: SubmitHandler<TBankAdd> = useCallback(
    (values: TBankAdd) => {
      // console.log('checkValueees', values);

      if (values.file) {
        const fd = new FormData();
        fd.append('file', values.file as File);

        uploadDocument(fd, {
          onSuccess: (resp) => {
            // console.log('checkResp_1', resp);
            if (resp.code === HTTP_STATUS.SUCCESS) {
              const newPayload: TBankAdd = {
                currencyId: values.currencyId,
                documentId: resp.data.id,
                paymentMode: values.paymentMode,
                name: values.name,
                beneficiaryName: values.beneficiaryName,
                city: values.city,
                accountNumber: values.accountNumber,
                iban: values.iban,
                swiftCode: values.swiftCode,
              };
              if (initialValue) {
                editBank({ id: initialValue.id, payload: newPayload });
              } else {
                addBank(newPayload);
              }
            } else {
              toast.error(resp.message);
            }
          },
        });
      } else if (initialValue) {
        const newPayload: TBankAdd = {
          currencyId: values.currencyId,
          documentId: values.documentId,
          paymentMode: values.paymentMode,
          name: values.name,
          beneficiaryName: values.beneficiaryName,
          city: values.city,
          accountNumber: values.accountNumber,
          iban: values.iban,
          swiftCode: values.swiftCode,
        };
        editBank({ id: initialValue.id, payload: newPayload });
      }
    },
    [addBank, editBank, initialValue, uploadDocument],
  );

  useEffect(() => {
    if (initialValue) {
      setValue('accountNumber', initialValue.accountNumber);
      setValue('beneficiaryName', initialValue.beneficiaryName);
      setValue('documentId', initialValue.proofDocument.id);
      setValue('iban', initialValue.iban);
      setValue('name', initialValue.name);
      setValue('paymentMode', initialValue.paymentMode);
      setValue('swiftCode', initialValue.swiftCode);
      setFileName(initialValue.proofDocument.name);
    }
  }, [initialValue, setValue]);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => onChangeOpen(open)}
    >
      <SheetContent className=" flex flex-col overflow-y-auto bg-white p-4 py-0">
        <SheetHeader className=" sticky top-0 bg-white pb-2 pt-4">
          <div className="flex items-center justify-between">
            <SheetTitle>{initialValue ? 'Edit Bank' : 'Add Bank'}</SheetTitle>
            <SheetClose>
              <FiX />
            </SheetClose>
          </div>
          <hr />
        </SheetHeader>
        <form onSubmit={handleSubmit(handleActualSubmit)}>
          <div className=" flex flex-1 flex-col gap-2">
            {/* begin: main form */}
            <div className=" space-y-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Bank Name
              </label>
              <Select
                onValueChange={(value) => onSelectCurrency(value)}
                // defaultValue={wchGender}
                value={wchCurrency}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">IDR</SelectItem>
                  <SelectItem value="2">USD</SelectItem>
                  <SelectItem value="3">EUR</SelectItem>
                </SelectContent>
              </Select>
              <span className="font-small text-sm text-red-600">
                {errors.currencyId?.message}
              </span>
            </div>
            <div className=" space-y-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Payment Mode
              </label>
              <Controller
                name="paymentMode"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your bank name"
                  />
                )}
              />
              <span className="font-small text-sm text-red-600">
                {errors.paymentMode?.message}
              </span>
            </div>
            <div className=" space-y-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Bank Name
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your bank name"
                  />
                )}
              />
              <span className="font-small text-sm text-red-600">
                {errors.name?.message}
              </span>
            </div>
            <div className=" space-y-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Account Holder Name
              </label>
              <Controller
                name="beneficiaryName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your holder name"
                  />
                )}
              />
              <span className="font-small text-sm text-red-600">
                {errors.beneficiaryName?.message}
              </span>
            </div>
            <div className=" space-y-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Account Number
              </label>
              <Controller
                name="accountNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your account number"
                  />
                )}
              />
              <span className="font-small text-sm text-red-600">
                {errors.accountNumber?.message}
              </span>
            </div>
            <div className=" space-y-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                IBAN
              </label>
              <Controller
                name="iban"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your iban number"
                  />
                )}
              />
              <span className="font-small text-sm text-red-600">
                {errors.iban?.message}
              </span>
            </div>
            <div className=" space-y-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Swift Code
              </label>
              <Controller
                name="swiftCode"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your Swift Code"
                  />
                )}
              />
              <span className="font-small text-sm text-red-600">
                {errors.swiftCode?.message}
              </span>
            </div>
            <div className=" space-y-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                City
              </label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your City"
                  />
                )}
              />
              <span className="font-small text-sm text-red-600">
                {errors.city?.message}
              </span>
            </div>
            <div className=" space-y-1">
              <label
                htmlFor=""
                className=" mr-4 text-sm font-medium text-neutral-800"
              >
                {fileName !== '' ? fileName : 'Document Proof'}
              </label>
              <Button
                type="button"
                onClick={handleTriggerFileChange}
              >
                Choose File
              </Button>
              <input
                ref={inputFileRef}
                type="file"
                className="hidden"
                id="upload-thumb"
                accept=".pdf"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  // console.log('checkFile', file)
                  if (file) {
                    setValue('file', file);
                    setFileName(file.name);
                  }
                }}
              />
              <span className="font-small text-sm text-red-600">
                {errors.documentId?.message}
              </span>
            </div>
            {/* end: main form */}
          </div>
          <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
            <Button
              type="submit"
              disabled={loading || loadingUpload || loadingEdit}
            >
              {loading || loadingUpload || loadingEdit ? '...' : 'Save'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default SheetAddBank;
