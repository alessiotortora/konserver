// components/forms/details-input.tsx
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DetailsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  details: { [key: string]: string };
  setDetails: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const DetailsInput = forwardRef<HTMLInputElement, DetailsInputProps>((props, ref) => {
  const { details, setDetails } = props;

  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const keyInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => keyInputRef.current!);

  const handleKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value.trim();

    if (details.hasOwnProperty(newKey)) {
      setError('This key already exists.');
    } else {
      setError(null);
    }

    setKeyInput(e.target.value);
  };

  const addDetail = () => {
    const trimmedKey = keyInput.trim();
    const trimmedValue = valueInput.trim();

    if (!trimmedKey || !trimmedValue) {
      setError('Key and Value cannot be empty.');
      return;
    }

    if (details.hasOwnProperty(trimmedKey)) {
      setError('This key already exists.');
      return;
    }

    setDetails({ ...details, [trimmedKey]: trimmedValue });
    setKeyInput('');
    setValueInput('');
    setError(null);
  };

  const updateDetail = (oldKey: string, newKey: string, newValue: string) => {
    const trimmedNewKey = newKey.trim();
    const trimmedNewValue = newValue.trim();

    if (!trimmedNewKey || !trimmedNewValue) {
      setError('Key and Value cannot be empty.');
      return;
    }

    if (oldKey !== trimmedNewKey && details.hasOwnProperty(trimmedNewKey)) {
      setError('This key already exists.');
      return;
    }

    const updatedDetails = { ...details };
    delete updatedDetails[oldKey];
    updatedDetails[trimmedNewKey] = trimmedNewValue;
    setDetails(updatedDetails);
    setError(null);
  };

  const removeDetail = (keyToRemove: string) => {
    const updatedDetails = { ...details };
    delete updatedDetails[keyToRemove];
    setDetails(updatedDetails);
    setError(null);
  };

  return (
    <div className="space-y-2">
      {Object.entries(details).map(([key, value], index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="flex-1">
            <Input
              placeholder="Key"
              value={key}
              onChange={(e) => updateDetail(key, e.target.value, value)}
            />
          </div>
          <div className="flex-1">
            <Input
              placeholder="Value"
              value={value}
              onChange={(e) => updateDetail(key, key, e.target.value)}
            />
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => removeDetail(key)}>
            <X size={14} />
          </Button>
        </div>
      ))}

      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            ref={keyInputRef}
            placeholder="New Key"
            value={keyInput}
            onChange={handleKeyInputChange}
          />
        </div>
        <div className="flex-1">
          <Input
            placeholder="New Value"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={addDetail}
          disabled={!!error || !keyInput.trim() || !valueInput.trim()}
        >
          Add
        </Button>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

DetailsInput.displayName = 'DetailsInput';

export default DetailsInput;
