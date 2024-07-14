'use client';

import { cn } from '@/lib/utils';
import { TProductCollectionFaker } from '@/types/faker.type';
import { Eye, Trash } from 'iconsax-react';
import { useState } from 'react';
import { FaPencil } from 'react-icons/fa6';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { TableCell, TableRow } from '../ui/table';

type TProductCollectionItemProps = {
  productCollection: TProductCollectionFaker;
};

export function ProductCollectionItem({
  productCollection,
}: TProductCollectionItemProps) {
  const [isActive, setIsActive] = useState<boolean>(productCollection.status);
  return (
    <TableRow
      className={cn(' bg-neutral-100', {
        'bg-blue-300': isActive,
      })}
    >
      <TableCell>{isActive ? 'Active' : 'Inactive'}</TableCell>
      <TableCell>{productCollection.collection_name}</TableCell>
      <TableCell>{productCollection.category}</TableCell>
      <TableCell>
        <ul className=" list-disc">
          {productCollection.product_list.map((product, i) => (
            <li key={i}>{product}</li>
          ))}
        </ul>
      </TableCell>
      <TableCell>{productCollection.store_id}</TableCell>
      <TableCell>{productCollection.collection_price}</TableCell>
      <TableCell>{productCollection.collection_discount_price}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            className=" data-[state=checked]:bg-green-600"
            checked={isActive}
            onCheckedChange={(checked) => setIsActive(checked)}
          />
          {isActive ? 'Active' : 'In Active'}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            className=" h-8 w-8 bg-blue-100"
          >
            <Eye
              size={16}
              className=" text-blue-500"
            />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className=" h-8 w-8 bg-blue-100"
          >
            <FaPencil
              size={12}
              className=" text-blue-500"
            />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className=" h-8 w-8 bg-red-100"
          >
            <Trash
              size={16}
              className=" text-red-500"
            />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
