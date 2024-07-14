import { useBrands } from '@/api/brand.api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { getLang } from '@/utils/locale.util';
import { useParams } from 'next/navigation';
import { Label } from '../ui/label';

function BrandSelect() {
  const params = useParams();
  const form = useFormContext();
  const { data: brands } = useBrands({ size: '99' });

  return (
    <>
      <Label className="mb-2">
        Brand <span className=" text-primary">*</span>
      </Label>
      <Select
        value={String(form.watch('brandId'))}
        onValueChange={(value: string) => {
          form.setValue(`brandId`, Number(value));
        }}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Input Brand" />
        </SelectTrigger>
        <SelectContent>
          {brands?.content.map((brand) => (
            <SelectItem
              value={String(brand.id)}
              key={brand.id}
            >
              {getLang(params, brand.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
export default BrandSelect;
