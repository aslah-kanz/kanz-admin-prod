import Image from 'next/image';
import { Trash } from 'iconsax-react';
import { FaArrowUp } from 'react-icons/fa6';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { uploadFileSingle } from '@/api/http/upload.service';
import { PRODUCT_PROPERTY_TYPE } from '@/constants/common.constant';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FiPlusCircle } from 'react-icons/fi';
import { useAttributes } from '@/api/attribute.api';
import { TProductPropertyTypeValue } from '@/types/common.type';
import { useState } from 'react';
import { getLang } from '@/utils/locale.util';
import { useParams } from 'next/navigation';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { PMSchemaKeys } from './schema';
import { FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

function PropertySection() {
  const params = useParams();
  const form = useFormContext();

  const { data: attributes } = useAttributes({ size: '99' });
  const [_update, setUpdate] = useState(false);

  const {
    fields: propertiesFields,
    append: propertiesAppends,
    remove: propertiesRemove,
  } = useFieldArray({
    name: 'properties',
    rules: { minLength: 1 },
  });

  const {
    getRootProps: getPropertyRootProps,
    getInputProps: getPropertyInputProps,
    open: propertyOpen,
  } = useDropzone({
    async onDrop(acceptedFiles, _, e) {
      const element = e.target as HTMLInputElement;
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      const { data } = await uploadFileSingle(formData);
      form.setValue(element.name as PMSchemaKeys, data as any);
    },
    noClick: true,
    multiple: false,
    accept: {
      'image/jpg': [],
      'image/png': [],
      'image/jpeg': [],
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className=" text-lg font-medium text-neutral-800">
          Product Property
        </p>
        <Button
          variant="ghost-primary"
          size="sm"
          className=" h-9"
          type="button"
          onClick={() =>
            propertiesAppends({
              name: {
                en: '',
                ar: '',
              },
              type: PRODUCT_PROPERTY_TYPE[0].value,
              fields: [],
              sequence: propertiesFields.length + 1,
              items: [
                {
                  attributeId: 0,
                  value1: null,
                  value2: null,
                  value3: null,
                  icon: '',
                },
              ],
            })
          }
        >
          Add Property
        </Button>
      </div>

      {propertiesFields.map((_field, i) => (
        <div
          key={i}
          className="flex flex-col gap-5 rounded-lg border p-4"
        >
          <div className="flex items-center justify-between">
            <p className=" font-medium text-neutral-800">Property {i + 1}</p>
            <div className="flex items-center gap-4">
              <button>
                <Trash
                  size={16}
                  className=" text-primary"
                  type="button"
                  onClick={() => propertiesRemove(i)}
                />
              </button>
            </div>
          </div>
          <Select
            value={form.getValues(`properties.${i}.type`)}
            onValueChange={(value: TProductPropertyTypeValue) => {
              form.setValue(`properties.${i}.type`, value);
              setUpdate((prev) => !prev);
            }}
          >
            <SelectTrigger className=" w-96">
              <SelectValue placeholder="Image" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_PROPERTY_TYPE.map((property) => (
                <SelectItem
                  value={property.value}
                  key={property.value}
                >
                  {property.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className=" grid grid-cols-12">
            <div className=" col-span-12 space-y-2 md:col-span-8 lg:col-span-6">
              <FormField
                name={`properties.${i}.name.en`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Property Name <span className=" text-primary">*</span>
                    </FormLabel>
                    <Input
                      placeholder="Input Property Name [en]"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={`properties.${i}.name.ar`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Input
                      placeholder="Input Property Name [ar]"
                      dir="rtl"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {form.getValues(`properties.${i}.type`) === 'image' && (
            <div className="grid grid-cols-3 items-stretch gap-6">
              {form
                .getValues(`properties.${i}.items`)
                ?.map((item: any, itemIndex: number) => (
                  <div
                    key={i}
                    className="flex flex-col gap-4 rounded-lg border p-4"
                  >
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const prev = form.getValues(`properties.${i}.items`);
                          prev.splice(itemIndex, 1);
                          form.setValue(`properties.${i}.items`, prev);
                          setUpdate((prev) => !prev);
                        }}
                      >
                        <Trash
                          size={16}
                          className=" text-primary"
                        />
                      </button>
                    </div>
                    <div
                      {...getPropertyRootProps({
                        className:
                          'flex items-center justify-center rounded-lg border-2 border-dashed bg-neutral-50 p-6',
                      })}
                    >
                      <input
                        {...getPropertyInputProps()}
                        name={`properties.${i}.items.${itemIndex}.icon`}
                      />
                      <div className=" relative aspect-square h-14">
                        <Image
                          src={item.icon.url || '/images/file-upload.svg'}
                          fill
                          alt=""
                          className=" object-contain object-center"
                        />
                      </div>
                      <div className="flex w-full flex-col items-center gap-2 text-center">
                        <p className=" text-sm text-neutral-500">
                          {item.icon.name || 'Drag or Upload File'}
                        </p>
                        <Button
                          onClick={propertyOpen}
                          type="button"
                          className=" h-8 w-fit gap-2"
                        >
                          <FaArrowUp size={12} />
                          Upload
                        </Button>
                      </div>
                    </div>
                    {/* <div className="flex flex-col gap-2">
                              <Label className=" text-sm">Description</Label>
                              <Input placeholder="Input product name" />
                            </div> */}
                  </div>
                ))}
              <div className=" flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary py-8">
                <Button
                  variant="destructive"
                  size="icon-sm"
                  type="button"
                  onClick={() => {
                    const prev = form.getValues(`properties.${i}.items`);
                    form.setValue(`properties.${i}.items`, [
                      ...prev,
                      {
                        attributeId: 0,
                        value1: null,
                        value2: null,
                        value3: null,
                        icon: '',
                      },
                    ]);
                    setUpdate((prev) => !prev);
                  }}
                >
                  <FiPlusCircle size={16} />
                </Button>
                <p className=" text-sm font-medium text-primary">Add Content</p>
              </div>
            </div>
          )}

          {form.getValues(`properties.${i}.type`) === 'table' && (
            <div className="flex flex-col">
              <div
                key={i}
                className="mb-8 flex gap-2 pr-12"
              >
                <div className="  grid flex-1 grid-cols-12 gap-2">
                  <div className=" col-span-6 space-y-2"></div>
                  <div className=" col-span-2 space-y-2">
                    <FormField
                      name={`properties.${i}.fields.0.en`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" text-xs">Header 1</FormLabel>
                          <Input
                            {...field}
                            placeholder="en"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name={`properties.${i}.fields.0.ar`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <Input
                            {...field}
                            dir="rtl"
                            placeholder="ar"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className=" col-span-2 space-y-2">
                    <FormField
                      name={`properties.${i}.fields.1.en`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" text-xs">Header 2</FormLabel>
                          <Input
                            {...field}
                            placeholder="en"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name={`properties.${i}.fields.1.ar`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <Input
                            {...field}
                            dir="rtl"
                            placeholder="ar"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className=" col-span-2 space-y-2">
                    <FormField
                      name={`properties.${i}.fields.2.en`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" text-xs">Header 3</FormLabel>
                          <Input
                            {...field}
                            placeholder="en"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name={`properties.${i}.fields.2.ar`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <Input
                            {...field}
                            dir="rtl"
                            placeholder="ar"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div
                key={i}
                className="flex gap-2 pr-12"
              >
                <div className="  grid flex-1 grid-cols-12 gap-2">
                  <div className=" col-span-6 space-y-2">
                    <Label className=" text-xs">Attribute</Label>
                  </div>
                  <div className=" col-span-2 space-y-2">
                    <Label className=" text-xs">Value 1</Label>
                  </div>
                  <div className=" col-span-2 space-y-2">
                    <Label className=" text-xs">Value 2</Label>
                  </div>
                  <div className=" col-span-2 space-y-2">
                    <Label className=" text-xs">Value 3</Label>
                  </div>
                </div>
              </div>

              {form
                .getValues(`properties.${i}.items`)
                ?.map((_item: any, itemIndex: number) => (
                  <div
                    key={itemIndex}
                    className="mb-4 flex gap-2"
                  >
                    <div className="  grid flex-1 grid-cols-12 gap-2">
                      <div className=" col-span-6 space-y-2">
                        <Select
                          value={form.getValues(
                            `properties.${i}.items.${itemIndex}.attributeId`,
                          )}
                          onValueChange={(value: string) => {
                            form.setValue(
                              `properties.${i}.items.${itemIndex}.attributeId`,
                              value,
                            );
                            setUpdate((prev) => !prev);
                            // setSelectedPropertyType(value);
                          }}
                        >
                          <SelectTrigger className="">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                          <SelectContent>
                            {attributes?.content.map(
                              (attribute, attributeIndex) => (
                                <SelectItem
                                  value={String(attribute.id)}
                                  key={attributeIndex}
                                >
                                  {getLang(params, attribute.name)}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className=" col-span-2 space-y-2">
                        <FormField
                          name={`properties.${i}.items.${itemIndex}.value1.en`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                {...field}
                                placeholder="en"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name={`properties.${i}.items.${itemIndex}.value1.ar`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                {...field}
                                dir="rtl"
                                placeholder="ar"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className=" col-span-2 space-y-2">
                        <FormField
                          name={`properties.${i}.items.${itemIndex}.value2.en`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                {...field}
                                placeholder="en"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name={`properties.${i}.items.${itemIndex}.value2.ar`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                {...field}
                                dir="rtl"
                                placeholder="ar"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className=" col-span-2 space-y-2">
                        <FormField
                          name={`properties.${i}.items.${itemIndex}.value3.en`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                {...field}
                                placeholder="en"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name={`properties.${i}.items.${itemIndex}.value3.ar`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                {...field}
                                dir="rtl"
                                placeholder="ar"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="transparent-destructive"
                      className=" self-end"
                      type="button"
                      onClick={() => {
                        const prev = form.getValues(`properties.${i}.items`);
                        prev.splice(itemIndex, 1);
                        form.setValue(`properties.${i}.items`, prev);
                        setUpdate((prev) => !prev);
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                ))}
              <Button
                variant="ghost-primary"
                size="sm"
                className=" self-end"
                type="button"
                onClick={() => {
                  const prev = form.getValues(`properties.${i}.items`);
                  form.setValue(`properties.${i}.items`, [
                    ...prev,
                    {
                      attributeId: 0,
                      value1: null,
                      value2: null,
                      value3: null,
                      icon: '',
                    },
                  ]);
                  setUpdate((prev) => !prev);
                }}
              >
                Add row
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
export default PropertySection;
