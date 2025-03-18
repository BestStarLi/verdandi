import { useState } from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// interface SchemaField {
//   name: string;
//   required: boolean;
//   type: string;
//   item?: string;
//   fields?: SchemaField[];
// }

// interface SchemaDefinition {
//   name: string;
//   type: string;
//   fields: SchemaField[];
// }

interface FieldsProps {
  toggleTypePanel: () => void;
  selectedType: string;
}

export default function Fields({ toggleTypePanel, selectedType }: FieldsProps) {
  const [isFieldsOpen, setIsFieldsOpen] = useState(false);

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
        <span>fields</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pl-6 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fieldName" className="text-base">
              name<span className="text-destructive">*</span>
            </Label>
            <Input id="fieldName" className="w-full" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="terms" className="text-base">
                required
              </Label>
              <Checkbox id="terms" className='cursor-pointer'/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-base">
                type
              </Label>
              <Button
                variant="outline"
                className="w-full justify-between cursor-pointer"
                onClick={toggleTypePanel}
              >
                <span>{selectedType || '请选择'}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </div>
          </div>
          {['map', 'array'].includes(selectedType) && (
            <div className="space-y-2">
              <Label htmlFor="item" className="text-base">
                item<span className="text-destructive">*</span>
              </Label>
              <Input id="item" className="w-full" />
            </div>
          )}
          {selectedType === 'object' && (
            <Fields
              toggleTypePanel={toggleTypePanel}
              selectedType={selectedType}
            />
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
