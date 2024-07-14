'use client';

import { cn } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';
import Pencxil from '../svg/Pencxil';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

type TButtonEditProps = {
  type: 'ghost' | 'destructive';
  toggleShow: () => void;
};

function ButtonEdit({ type, toggleShow }: TButtonEditProps) {
  return type === 'ghost' ? (
    <button onClick={toggleShow}>
      <Pencxil className=" fill-primary" />
    </button>
  ) : (
    <Button
      variant="destructive"
      size="icon-sm"
      onClick={toggleShow}
    >
      <Pencxil />
    </Button>
  );
}

type TToggleEditProps = {
  value: string;
  label: string;
  size?: 'base' | 'sm';
  setValue: (value: string) => void;
  buttonEditVariant?: 'ghost' | 'destructive';
  type?: 'text' | 'password' | 'textarea';
};

export default function ToggleEdit({
  value,
  setValue,
  size = 'sm',
  label,
  buttonEditVariant = 'ghost',
  type,
}: TToggleEditProps) {
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [localValue, setLocalValue] = useState<string>(value);

  // toggle show
  const toggleShow = useCallback(() => setShowEdit((prev) => !prev), []);

  // handle save change with local value
  const handleSave = useCallback(() => {
    toggleShow();
    setValue(localValue);
  }, [localValue, toggleShow, setValue]);

  // handle cancel
  const handleCancel = useCallback(() => {
    toggleShow();
    setValue(value);
  }, [value, setValue, toggleShow]);

  // assign real value
  useEffect(() => {
    setLocalValue(value);
  }, [value, showEdit]);

  return (
    <div className=" space-y-2">
      <div className=" flex items-center justify-between">
        <Label className={cn({ 'text-sm': size === 'sm' })}>{label}</Label>
        {!showEdit ? (
          <ButtonEdit
            type={buttonEditVariant}
            toggleShow={toggleShow}
          />
        ) : (
          <div className="flex gap-2">
            <Button
              size="icon-sm"
              variant="success"
              onClick={handleSave}
            >
              <FaCheck size={12} />
            </Button>
            <Button
              size="icon-sm"
              variant="destructive"
              onClick={handleCancel}
            >
              <FiX size={12} />
            </Button>
          </div>
        )}
      </div>
      {!showEdit ? (
        <p
          className={cn(' font-medium text-neutral-500', {
            'text-sm': size === 'sm',
          })}
        >
          {value}
        </p>
      ) : type === 'textarea' ? (
        <Textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
        />
      ) : (
        <Input
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
        />
      )}
    </div>
  );
}
