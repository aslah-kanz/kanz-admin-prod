'use client';

import { cn } from '@/lib/utils';

import { PopoverClose } from '@radix-ui/react-popover';
import BulletList from '@tiptap/extension-bullet-list';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import {
  EditorContent,
  Editor as TiptapEditor,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { MdFormatListBulleted, MdFormatListNumbered } from 'react-icons/md';
import FontSize from 'tiptap-extension-font-size';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

Color.configure({
  types: ['textStyle'],
});

function MenuBar({ editor }: { editor: TiptapEditor }) {
  return (
    <div className=" sticky top-0 flex w-full flex-wrap gap-4 overflow-hidden border-b bg-neutral-100 p-3">
      <div className="flex">
        <Select
          defaultValue="16"
          onValueChange={(value) =>
            editor.chain().focus().setFontSize(`${value}pt`).run()
          }
        >
          <SelectTrigger className="h-8 w-[56px] pr-2 text-xs">
            <SelectValue placeholder="16" />
          </SelectTrigger>
          <SelectContent className=" w-fit">
            {[12, 14, 16, 18, 20, 24, 28, 34].map((value) => (
              <SelectItem
                key={value}
                value={value.toString()}
              >
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className=" h-8 w-px border-r"></div>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <p className=" text-xs">Text</p>
          <Popover>
            <PopoverTrigger asChild>
              <div
                className=" aspect-square w-4 rounded-[4px]"
                style={{
                  background: editor.getAttributes('textStyle').color ?? '#000',
                }}
              />
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              className=" w-fit"
            >
              <div className="flex items-center gap-2">
                <PopoverClose asChild>
                  <div
                    role="presentation"
                    className=" h-4 w-4 rounded-[4px] bg-black"
                    onClick={() => editor.chain().focus().unsetColor().run()}
                  />
                </PopoverClose>
                <PopoverClose asChild>
                  <div
                    role="presentation"
                    className=" h-4 w-4 rounded-[4px] bg-primary"
                    onClick={() =>
                      editor.chain().focus().setColor('#ef3b23').run()
                    }
                  />
                </PopoverClose>
                <PopoverClose asChild>
                  <div
                    role="presentation"
                    className=" h-4 w-4 rounded-[4px] bg-yellow-500"
                    onClick={() =>
                      editor.chain().focus().setColor('#eab308').run()
                    }
                  />
                </PopoverClose>
                <PopoverClose asChild>
                  <div
                    role="presentation"
                    className=" h-4 w-4 rounded-[4px] bg-green-600"
                    onClick={() =>
                      editor.chain().focus().setColor('#16a34a').run()
                    }
                  />
                </PopoverClose>
                <PopoverClose asChild>
                  <div
                    role="presentation"
                    className=" h-4 w-4 rounded-[4px] bg-blue-600"
                    onClick={() =>
                      editor.chain().focus().setColor('#2563eb').run()
                    }
                  />
                </PopoverClose>
                <PopoverClose asChild>
                  <div
                    role="presentation"
                    className=" h-4 w-4 rounded-[4px] bg-red-500"
                    onClick={() =>
                      editor.chain().focus().setColor('#ef4444').run()
                    }
                  />
                </PopoverClose>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className=" h-8 w-px border-r" />
      <div className="flex items-center">
        <Button
          size="icon-sm"
          variant="transparent"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn('h-6 w-6 text-sm text-neutral-400', {
            'text-neutral-950': editor.isActive('bold'),
          })}
        >
          B
        </Button>
        <Button
          size="icon-sm"
          variant="transparent"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn('h-6 w-6 text-sm italic text-neutral-400', {
            'text-neutral-950': editor.isActive('italic'),
          })}
          style={{ fontFamily: 'serif' }}
        >
          I
        </Button>
        <Button
          size="icon-sm"
          variant="transparent"
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={cn(
            'h-6 w-6 text-sm text-neutral-400 underline underline-offset-2',
            {
              'text-neutral-950': editor.isActive('underline'),
            },
          )}
        >
          U
        </Button>
      </div>
      <div className=" h-8 w-px border-r" />
      <div className="flex items-center">
        <Button
          size="icon-sm"
          variant="transparent"
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          className={cn(
            'h-6 w-6 text-base text-neutral-400 underline underline-offset-2',
            {
              'text-neutral-950': editor.isActive('bulletList'),
            },
          )}
        >
          <MdFormatListBulleted />
        </Button>
        <Button
          size="icon-sm"
          variant="transparent"
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          className={cn(
            'h-6 w-6 text-base text-neutral-400 underline underline-offset-2',
            {
              'text-neutral-950': editor.isActive('orderedList'),
            },
          )}
        >
          <MdFormatListNumbered />
        </Button>
      </div>
    </div>
  );
}

const extensions = [
  StarterKit.configure(),
  Underline,
  TextStyle,
  FontSize,
  FontFamily,
  Color,
  ListItem,
  BulletList,
  OrderedList,
];

interface TiptapEditorProps {
  setValue: (value: string) => void;
  value?: string;
  isAr?: boolean;
}

function Editor({ value, setValue, isAr = false }: TiptapEditorProps) {
  const editor = useEditor({
    content: value,
    extensions,
    editorProps: {
      attributes: {
        class:
          'prose [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:px-4 [&_ul]:px-4 p-2.5 px-4 focus:outline-none min-h-[196px] w-full max-w-full',
      },
    },

    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });
  if (!editor) return null;

  return (
    <div
      className=" max-[300px]: overflow-hidden rounded-lg border border-slate-200 shadow-sm"
      dir="ltr"
    >
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        dir={isAr ? 'rtl' : 'ltr'}
        placeholder="Type something..."
      />
    </div>
  );
}

export default Editor;
