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
  parentId?: string;
}

interface SchemaDefinition {
  name: string;
  extends: string;
  fields: SchemaField[];
}

interface FieldData {
  name: string;
  required: boolean;
  parentId?: string;
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
    const fieldMap: Record<string, any> = {};

    Object.entries(fieldData).forEach(([fieldId, field]) => {
      const type = selectedTypes[fieldId] || '';
      const item = selectedItems[fieldId] || undefined;
      
      fieldMap[fieldId] = {
        id: fieldId,
        name: field.name || '',
        ...(field.required && { required: true }),
        type: type,
        ...(item && { item }),
        parentId: field.parentId,
        fields: {},
      };
    });

    const rootFields: Record<string, any> = {};

    Object.values(fieldMap).forEach(field => {
      if (!field.parentId && field.name) {
        rootFields[field.name] = {
          ...(field.required && { required: true }),
          type: field.type,
          ...(field.item && { item: { type: field.item } }),
          ...(field.type === 'object' && { fields: {} }),
        };
      }
    });
    
    Object.values(fieldMap).forEach(field => {
      if (field.parentId && field.name) {

        const parentField = fieldMap[field.parentId];
        if (parentField) {

          let targetParent;
          
          if (!parentField.parentId) {
            targetParent = rootFields[parentField.name];
          } else {

            const findParentInStructure = (parentId: string, structure: Record<string, any>): any => {
              for (const key in structure) {
                if (fieldMap[parentId]?.name === key) {
                  return structure[key];
                }
                if (structure[key].fields) {
                  const found = findParentInStructure(parentId, structure[key].fields);
                  if (found) return found;
                }
              }
              return null;
            };
            
            targetParent = findParentInStructure(field.parentId, rootFields);
          }
          
          if (targetParent) {
            if (!targetParent.fields) {
              targetParent.fields = {};
            }
            
            targetParent.fields[field.name] = {
              ...(field.required && { required: true }),
              type: field.type,
              ...(field.item && { item: { type: field.item } }),
              ...(field.type === 'object' && { fields: {} }),
            };
          }
        }
      }
    });

    const cleanEmptyFields = (obj: Record<string, any>) => {
      if (!obj) return;
      
      Object.keys(obj).forEach(key => {
        if (obj[key]?.fields && Object.keys(obj[key].fields).length === 0) {
          delete obj[key].fields;
        } else if (obj[key]?.fields) {
          cleanEmptyFields(obj[key].fields);
        }
      });
    };
    
    cleanEmptyFields(rootFields);

    const json: any = {
      name: schema.name,
      ...(schema.extends && schema.extends.trim() !== '' && { extends: schema.extends }),
      fields: rootFields,
    };

    return json;
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

export function generateNewFieldId() {
  return `field-${Date.now()}`; 
};

