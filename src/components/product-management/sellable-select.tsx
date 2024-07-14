import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { Label } from '../ui/label';

function SellableSelect() {
  const form = useFormContext();

  return (
    <>
      <Label className="mb-2">
        Sellable <span className=" text-primary">*</span>
      </Label>
      <Select
        value={String(form.getValues('sellable'))}
        onValueChange={(value: string) => {
          form.setValue(`sellable`, value);
          form.trigger('sellable');
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sellable" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">true</SelectItem>
          <SelectItem value="false">false</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
export default SellableSelect;
