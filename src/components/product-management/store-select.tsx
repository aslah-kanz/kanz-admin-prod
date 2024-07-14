import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { useGetStoresOptions } from '@/api/store.api';
import { Label } from '../ui/label';

function StoreSelect() {
  const form = useFormContext();
  const { data: stores } = useGetStoresOptions({ size: '99' });

  return (
    <>
      <Label className="mb-2">
        Store <span className=" text-primary">*</span>
      </Label>
      <Select
        value={String(form.getValues('storeId'))}
        onValueChange={(value: string) => {
          form.setValue(`storeId`, Number(value));
          form.trigger('storeId');
        }}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Input Store" />
        </SelectTrigger>
        <SelectContent>
          {stores?.content?.map((store) => (
            <SelectItem
              value={String(store.id)}
              key={store.id}
            >
              {store.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
export default StoreSelect;
