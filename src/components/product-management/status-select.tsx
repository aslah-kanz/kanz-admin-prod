import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { Label } from '../ui/label';

function StatusSelect() {
  const form = useFormContext();

  return (
    <>
      <Label className="mb-2">
        Status <span className=" text-primary">*</span>
      </Label>
      <Select
        value={String(form.getValues('status'))}
        onValueChange={(value: string) => {
          form.setValue(`status`, value);
          form.trigger('status');
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sellable" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="pendingApproval">Pending Approval</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="published">Published</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
export default StatusSelect;
