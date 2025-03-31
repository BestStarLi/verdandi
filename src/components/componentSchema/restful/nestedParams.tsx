import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';

export default function NestedParams() {
  const [isFieldsOpen, setIsFieldsOpen] = useState(true);
  const [selectedKind, setSelectedKind] = useState<string>("");

  return (
    <Collapsible
      open={isFieldsOpen}
      onOpenChange={setIsFieldsOpen}
      className="space-y-2"
    >
      <CollapsibleTrigger className="flex items-center gap-2 w-full hover:bg-gray-100 rounded-md p-2 transition-all duration-300">
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            isFieldsOpen ? 'transform rotate-180' : ''
          }`}
        />
        <span>nestedParams</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pl-4 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-base">
              name<span className="text-destructive">*</span>
            </Label>
            <Input placeholder="Required" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label className="text-base">is pathParam</Label>
              <Checkbox className="cursor-pointer" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-base">description</Label>
            <Input />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kind" className="text-base">
              kind
            </Label>
            <Select onValueChange={(value) => setSelectedKind(value)}>
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

          {selectedKind === "simple" && (
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
          {(selectedKind === "array" || selectedKind === "object") && <NestedParams />}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
