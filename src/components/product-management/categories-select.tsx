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
import { useCategories } from '@/api/category.api';
import { TCategory } from '@/types/category.type';
import { useMemo, useState } from 'react';
import { Label } from '../ui/label';

function CategoriesSelect() {
  const [isOpen, setIsOpen] = useState(false);

  const params = useParams();

  const form = useFormContext();
  const { data: categories } = useCategories({ size: '99' });

  const categoryValue = form.watch(`categoryId`);

  return useMemo(
    () => (
      <>
        <Label className="mb-2">
          Category <span className=" text-primary">*</span>
        </Label>
        <Select
          open={isOpen}
          onOpenChange={(value: boolean) => {
            setIsOpen(value);
          }}
          value={String(categoryValue)}
          onValueChange={(value: string) => {
            form.setValue(`categoryId`, Number(value));
          }}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Input Category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category: TCategory) => (
              <SelectItem
                value={String(category.id)}
                key={category.id}
              >
                {getLang(params, category.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </>
    ),
    [categories, categoryValue, form, isOpen, params],
  );
}
export default CategoriesSelect;
