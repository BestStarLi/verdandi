import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import NestedParams from './nestedParams';

interface NewParamsPanelProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function NewParamsPanel({
  onClose,
  onSuccess,
}: NewParamsPanelProps) {
  const [name, setName] = useState('');
  const [isPathParam, setIsPathParam] = useState(false);
  const [description, setDescription] = useState('');
  const [kind, setKind] = useState('');
  const [type, setType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const paramData = {
        name,
        type: kind === 'simple' ? type : kind,
        required: isPathParam,
        description,
      };

      const response = await fetch('http://localhost:8000/request-params', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paramData),
      });

      const result = await response.json();

      if (result.success) {
        if (onSuccess) onSuccess();
        onClose();
        if (onSuccess) onSuccess();
      } else {
        throw new Error(result.error || 'Save Failed');
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border p-4 gap-4">
      <h2 className="text-2xl font-bold">New Request Param Definition</h2>
      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-15rem)]">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base">
            name<span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            required
            className="w-full"
            placeholder="required"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label className="text-base">is pathParam</Label>
            <Checkbox
              className="cursor-pointer"
              checked={isPathParam}
              onCheckedChange={(checked) => setIsPathParam(checked === true)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-base">
            description
          </Label>
          <Input
            id="description"
            className="w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="kind" className="text-base">
            kind
          </Label>
          <Select onValueChange={setKind} value={kind}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="select a kind" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="simple">simple</SelectItem>
                <SelectItem value="array">array</SelectItem>
                <SelectItem value="object">object</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {kind === 'simple' && (
          <div className="space-y-2">
            <Label htmlFor="type" className="text-base">
              type
            </Label>
            <Select onValueChange={setType} value={type}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="string">string</SelectItem>
                  <SelectItem value="int">int</SelectItem>
                  <SelectItem value="float64">float64</SelectItem>
                  <SelectItem value="bool">bool</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        {(kind === 'array' || kind === 'object') && <NestedParams />}

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            className="min-w-[80px] border border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black cursor-pointer"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="min-w-[80px] bg-black hover:bg-black/90 cursor-pointer"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Uploading...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
}
