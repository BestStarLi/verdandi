'use client';

import type React from 'react';
import {
  createContext,
  useState,
  useMemo,
  useContext,
  type ReactNode,
} from 'react';

interface SchemaField {
  name: string;
  required: boolean;
  type: string;
  item?: string;
}

interface SchemaDefinition {
  name: string;
  extends: string;
  fields: SchemaField[];
}

interface FieldData {
  name: string;
  required: boolean;
}

interface NodeSchemaContextType {
  schema: SchemaDefinition;
  setSchema: React.Dispatch<React.SetStateAction<SchemaDefinition>>;
  selectedTypes: Record<string, string>;
  setSelectedTypes: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  selectedItems: Record<string, string>;
  setSelectedItems: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  fieldData: Record<string, FieldData>;
  setFieldData: React.Dispatch<React.SetStateAction<Record<string, FieldData>>>;
  schemaJSON: any;
  updateName: (name: string) => void;
  updateFieldName: (fieldId: string, name: string) => void;
  updateFieldRequired: (fieldId: string, required: boolean) => void;
}

const NodeSchemaContext = createContext<NodeSchemaContextType | undefined>(
  undefined
);

export function NodeSchemaProvider({ children }: { children: ReactNode }) {
  const [schema, setSchema] = useState<SchemaDefinition>({
    name: '',
    extends: '',
    fields: [],
  });

  const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>(
    {}
  );
  const [selectedItems, setSelectedItems] = useState<Record<string, string>>(
    {}
  );
  const [fieldData, setFieldData] = useState<Record<string, FieldData>>({});

  const updateName = (name: string) => {
    setSchema((prev) => ({ ...prev, name }));
  };

  const updateFieldName = (fieldId: string, name: string) => {
    setFieldData((prev) => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], name },
    }));
  };

  const updateFieldRequired = (fieldId: string, required: boolean) => {
    setFieldData((prev) => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], required },
    }));
  };

  const generateSchemaJSON = () => {
    const fields = Object.entries(selectedTypes).map(([fieldId, type]) => {
      const field = fieldData[fieldId] || { name: fieldId, required: true };
      return {
        name: field.name || fieldId,
        required: field.required,
        type: type,
        item: selectedItems[fieldId] || undefined,
      };
    });

    return {
      name: schema.name,
      extends: schema.extends,
      fields: fields,
    };
  };

  const schemaJSON = useMemo(
    () => generateSchemaJSON(),
    [schema, selectedTypes, selectedItems, fieldData]
  );

  const value = {
    schema,
    setSchema,
    selectedTypes,
    setSelectedTypes,
    selectedItems,
    setSelectedItems,
    fieldData,
    setFieldData,
    schemaJSON,
    updateName,
    updateFieldName,
    updateFieldRequired,
  };

  return (
    <NodeSchemaContext.Provider value={value}>
      {children}
    </NodeSchemaContext.Provider>
  );
}

export function useNodeSchema() {
  const context = useContext(NodeSchemaContext);
  if (context === undefined) {
    throw new Error('useNodeSchema must be used within a NodeSchemaProvider');
  }
  return context;
}
