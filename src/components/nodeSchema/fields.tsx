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
  toggleTypePanel: (fieldId: string, isItem?: boolean) => void;
  selectedTypes: Record<string, string>;
  selectedItems: Record<string, string>;
  fieldId?: string;
}

export default function Fields({
  toggleTypePanel,
  selectedTypes,
  selectedItems,
  fieldId = 'root',
}: FieldsProps) {
  const [isFieldsOpen, setIsFieldsOpen] = useState(true);
  const selectedType = selectedTypes[fieldId] || '';
  const selectedItem = selectedItems[fieldId] || '';
  const nestedFieldId = `${fieldId}-nested`;

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
            <Label htmlFor={`fieldName-${fieldId}`} className="text-base">
              name<span className="text-destructive">*</span>
            </Label>
            <Input
              id={`fieldName-${fieldId}`}
              className="w-full"
              placeholder="Required"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor={`terms-${fieldId}`} className="text-base">
                required
              </Label>
              <Checkbox id={`terms-${fieldId}`} className="cursor-pointer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`type-${fieldId}`} className="text-base">
                type
              </Label>
              <Button
                variant="outline"
                className="w-full justify-between cursor-pointer"
                onClick={() => toggleTypePanel(fieldId, false)}
              >
                <span>{selectedType || '请选择'}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </div>
          </div>
          {['map', 'array'].includes(selectedType) && (
            <div className="space-y-2">
              <Label htmlFor={`item-${fieldId}`} className="text-base">
                item
              </Label>
              <Button
                variant="outline"
                className="w-full justify-between cursor-pointer"
                onClick={() => toggleTypePanel(fieldId, true)}
              >
                <span>{selectedItem || '请选择'}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </div>
          )}
          {selectedType === 'object' && (
            <Fields
              toggleTypePanel={toggleTypePanel}
              selectedTypes={selectedTypes}
              selectedItems={selectedItems}
              fieldId={nestedFieldId}
            />
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
