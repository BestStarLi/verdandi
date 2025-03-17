import { useState } from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function fields() {
  const [isFieldsOpen, setIsFieldsOpen] = useState(false);

  return (
    <Collapsible
      open={isFieldsOpen}
      onOpenChange={setIsFieldsOpen}
      className="space-y-2"
    >
      <CollapsibleTrigger className="flex items-center gap-2">
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isFieldsOpen ? 'transform rotate-180' : ''
          }`}
        />
        <span>fields</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pl-6">
        <div className="space-y-2">
          <Label htmlFor="fieldName" className="text-base">
            name<span className="text-destructive">*</span>
          </Label>
          <Input id="fieldName" className="w-full" />
        </div>
        <ul className="space-y-2 list-none pl-4">
          <li>- required</li>
          <li>- type</li>
          <li>- item</li>
          <li>- fields</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
