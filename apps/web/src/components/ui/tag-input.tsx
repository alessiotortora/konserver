'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagInput = forwardRef<HTMLInputElement, TagInputProps>((props, ref) => {
  const { placeholder, tags, setTags, className } = props;

  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => inputRef.current!);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="bg-card flex items-center gap-1 rounded-md border p-1">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex h-8 w-auto items-center gap-x-3 whitespace-nowrap rounded-md border px-2 text-sm transition-all"
        >
          {tag}
          <X
            size={14}
            className="cursor-pointer"
            onClick={() => removeTag(tag)}
          />
        </span>
      ))}

      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={cn(
          'focus-visible: min-w-10 flex-grow border-none outline-none focus-visible:ring-transparent',
          className,
        )}
      />
    </div>
  );
});

TagInput.displayName = 'TagInput';

export { TagInput };
