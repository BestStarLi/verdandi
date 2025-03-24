'use client';

import { useState, useEffect } from 'react';
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
import { useNodeSchema } from './nodeSchemaContext';

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
  fieldId = '',
}: FieldsProps) {
  const { fieldData, updateFieldName, updateFieldRequired } =
    useNodeSchema();
  const [isFieldsOpen, setIsFieldsOpen] = useState(true);
  const [nameError, setNameError] = useState(false);
  const selectedType = selectedTypes[fieldId] || '';
  const selectedItem = selectedItems[fieldId] || '';
  const nestedFieldId = `${fieldId}-nested`;
  const currentField = fieldData[fieldId] || { name: '', required: false };

  useEffect(() => {
    if (!fieldData[fieldId] && fieldId) {
      updateFieldName(fieldId, '');
      updateFieldRequired(fieldId, false);
    }
  }, [fieldId, fieldData, updateFieldName, updateFieldRequired]);

  const handleNameChange = (value: string) => {
    updateFieldName(fieldId, value);
    if (value.trim() === '') {
      setNameError(true);
    } else {
      setNameError(false);
    }
    
    const nameInput = document.getElementById(`fieldName-${fieldId}`);
    if (nameInput) {
      if (value.trim() === '') {
        nameInput.classList.add('border-red-500');
      } else {
        nameInput.classList.remove('border-red-500');
      }
    }
  };

  const handleRequiredChange = (checked: boolean) => {
    updateFieldRequired(fieldId, checked);
  };


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
      <CollapsibleContent className="space-y-4 pl-4 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`fieldName-${fieldId}`} className="text-base">
              name<span className="text-destructive">*</span>
            </Label>
            <Input
              id={`fieldName-${fieldId}`}
              className={`w-full ${nameError ? 'border-red-500' : ''}`}
              placeholder="Required"
              value={currentField.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
            {nameError && (
              <p className="text-sm text-red-500">字段名称不能为空</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor={`terms-${fieldId}`} className="text-base">
                required
              </Label>
              <Checkbox
                id={`terms-${fieldId}`}
                className="cursor-pointer"
                checked={currentField.required}
                onCheckedChange={handleRequiredChange}
              />
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
            <div className="mt-4 pl-4 border-gray-300">
              <Fields
                toggleTypePanel={toggleTypePanel}
                selectedTypes={selectedTypes}
                selectedItems={selectedItems}
                fieldId={nestedFieldId}
              />
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
