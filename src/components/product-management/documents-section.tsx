import Image from 'next/image';
import { Trash } from 'iconsax-react';
import { FaArrowUp } from 'react-icons/fa6';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

type Props = {
  uploadedDocuments: File[];
  setUploadedDocuments: Dispatch<SetStateAction<File[]>>;
};

function DocumentsSection({ uploadedDocuments, setUploadedDocuments }: Props) {
  const form = useFormContext();

  const {
    getRootProps: getDocRootProps,
    getInputProps: getDocInputProps,
    open: docOpen,
  } = useDropzone({
    async onDrop(acceptedFiles, _) {
      setUploadedDocuments((prev) => {
        return [...prev, acceptedFiles[0]];
      });
    },
    noClick: true,
    multiple: false,
    accept: {
      'application/pdf': [],
    },
  });

  const {
    fields: documentFields,
    append: documentAppends,
    remove: documentRemove,
  } = useFieldArray({
    name: 'documents',
    rules: { minLength: 1 },
  });

  const handleDeleteDocument = (index: number) => {
    documentRemove(index);

    setUploadedDocuments((prev) => prev.splice(index, 1));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className=" text-lg font-medium text-neutral-800">
          Product Document (max 5)
        </p>
        {documentFields.length < 5 && (
          <Button
            variant="ghost-primary"
            size="sm"
            className=" h-9"
            type="button"
            onClick={documentAppends}
          >
            Add Document
          </Button>
        )}
      </div>
      {documentFields.map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <Label className=" text-sm">
              Document {i + 1}
              {uploadedDocuments[i]?.name && ': '}
              <span className="font-bold">{uploadedDocuments[i]?.name}</span>
            </Label>
            <Button
              variant="destructive"
              size="icon-sm"
              type="button"
              onClick={() => {
                handleDeleteDocument(i);
              }}
            >
              <Trash size={16} />
            </Button>
          </div>
          {!uploadedDocuments[i]?.name && (
            <div
              key={i}
              {...getDocRootProps({
                className:
                  'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6',
              })}
            >
              <input
                {...getDocInputProps()}
                name={`documents.${i}`}
              />
              <div className="flex w-full flex-col items-center gap-4 text-center">
                <div className=" relative aspect-square h-14">
                  <Image
                    src={
                      form.getValues('documents')[i].file ||
                      '/images/file-upload.svg'
                    }
                    fill
                    alt=""
                    className=" object-contain object-center"
                  />
                </div>
                <p className=" text-sm text-neutral-500">
                  {form.getValues('documents')[i].name || 'Drag or Upload File'}
                </p>
                <Button
                  onClick={docOpen}
                  type="button"
                  className=" h-8 gap-2"
                >
                  <FaArrowUp size={12} />
                  Upload
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
export default DocumentsSection;
