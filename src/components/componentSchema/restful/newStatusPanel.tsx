import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import NestedParams from './nestedParams';

interface NewStatusPanelProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function NewStatusPanel({
  onClose,
  // onSuccess,
}: NewStatusPanelProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg border p-4 gap-4">
      <h2 className="text-2xl font-bold">New Response Status Definition</h2>
      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-15rem)]">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base">
            code<span className="text-destructive">*</span>
          </Label>
          <Input id="name" required className="w-full" placeholder="required" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-base">
            description
          </Label>
          <Input id="description" className="w-full" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="kind" className="text-base">
            kind
          </Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="select a kind" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="none">none</SelectItem>
                <SelectItem value="json">application/json</SelectItem>
                <SelectItem value="xml">application/xml</SelectItem>
                <SelectItem value="textplain">text/plain</SelectItem>
                <SelectItem value="octetstream">
                  application/octet-stream
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="type" className="text-base">
            type
          </Label>
          <Input id="description" className="w-full" />
        </div>
        <NestedParams />

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            className="min-w-[80px] border border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button className="min-w-[80px] bg-black hover:bg-black/90 cursor-pointer">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
