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
import { Separator } from '@/components/ui/separator';


interface NewParamsPanelProps {
  onClose: () => void;
}

export default function NewParamsPanel({ onClose }: NewParamsPanelProps) {
  const [kind, setKind] = useState('');

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border p-4 gap-4">
      <h2 className="text-2xl font-bold">New Request Param Definition</h2>
      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-15rem)]">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base">
            name<span className="text-destructive">*</span>
          </Label>
          <Input id="name" required className="w-full" placeholder="Required" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label className="text-base">is pathParam</Label>
            <Checkbox className="cursor-pointer" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-base">
            description
          </Label>
          <Input id="description" required className="w-full" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="kind" className="text-base">
            kind
          </Label>
          <Select onValueChange={setKind}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="select a kind" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="simple">simple</SelectItem>
                <Separator />
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
            <Select>
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
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            className="min-w-[80px] border border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black cursor-pointer"
            onClick={onClose}
          >
            No
          </Button>
          <Button className="min-w-[80px] bg-black hover:bg-black/90 cursor-pointer">
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
}
