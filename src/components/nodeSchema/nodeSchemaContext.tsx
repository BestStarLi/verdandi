'use client';

import type React from 'react';
import {
  createContext,
  useState,
  useMemo,
  useContext,
  type ReactNode,
} from 'react';

interface SchemaDefinition {
  name: string;
  extends: string;
  fields: SchemaField[];
}

interface SchemaField {
  name: string;
  required: boolean;
  type: string;
  item?: string;
  fields?: SchemaField[];
  parentId?: string;
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
  addNestedField: (parentFieldId: string) => void;
  addRootField: () => void;
  setFieldParent: (fieldId: string, parentFieldId: string) => void;
  clearChildFields: (fieldId: string) => void;
  responseStatus: string;
  setResponseStatus: React.Dispatch<React.SetStateAction<string>>;
}

const NodeSchemaContext = createContext<NodeSchemaContextType | undefined>(
  undefined
);

export function useNodeSchema() {
  const context = useContext(NodeSchemaContext);
  if (context === undefined) {
    throw new Error('useNodeSchema must be used within a NodeSchemaProvider');
  }
  return context;
}

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
  const [responseStatus, setResponseStatus] = useState<string>('');

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

  const addNestedField = (parentFieldId: string) => {
    const newFieldId = generateNewFieldId();
    console.log('添加嵌套字段，父字段ID:', parentFieldId);
    console.log('当前所有字段数据:', fieldData);
    
    setFieldData((prev) => ({
      ...prev,
      [newFieldId]: {
        name: '',
        required: false,
        parentId: parentFieldId,
      },
    }));
    
    setSelectedTypes((prev) => ({
      ...prev,
      [newFieldId]: '',
    }));
  };

  const addRootField = () => {
    const newFieldId = generateNewFieldId();
    setFieldData((prev) => ({
      ...prev,
      [newFieldId]: {
        name: '',
        required: false,
        parentId: undefined,
      },
    }));
    
    setSelectedTypes((prev) => ({
      ...prev,
      [newFieldId]: '',
    }));
  };

  const setFieldParent = (fieldId: string, parentFieldId: string) => {
    console.log('设置字段父级，字段ID:', fieldId, '父字段ID:', parentFieldId);
    console.log('当前所有字段数据:', fieldData);
    
    setFieldData((prev) => ({
      ...prev,
      [fieldId]: { 
        ...prev[fieldId], 
        parentId: parentFieldId 
      },
    }));
  };

  const clearChildFields = (fieldId: string) => {
    setFieldData((prev) => {
      const newFieldData = { ...prev };
      Object.keys(newFieldData).forEach((key) => {
        if (key.startsWith(`${fieldId}-nested`)) {
          delete newFieldData[key];
        }
      });
      return newFieldData;
    });

    setSelectedTypes((prev) => {
      const newTypes = { ...prev };
      Object.keys(newTypes).forEach((key) => {
        if (key.startsWith(`${fieldId}-nested`)) {
          delete newTypes[key];
        }
      });
      return newTypes;
    });

    setSelectedItems((prev) => {
      const newItems = { ...prev };
      Object.keys(newItems).forEach((key) => {
        if (key.startsWith(`${fieldId}-nested`)) {
          delete newItems[key];
        }
      });
      return newItems;
    });
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
        ...((type === 'array' || type === 'map') && { 
          item: item || ''
        }),
        parentId: field.parentId,
      };
    });

    Object.values(fieldMap).forEach(field => {
      if (field.id.includes('-nested') && !field.parentId) {
        const nestedLevels = (field.id.match(/-nested/g) || []).length;
        
        const potentialParents = Object.values(fieldMap)
          .filter(parentField => {
            const parentNestedLevels = (parentField.id.match(/-nested/g) || []).length;
            return parentNestedLevels === nestedLevels - 1;
          })
          .sort((a, b) => a.id.localeCompare(b.id));
        
        if (potentialParents.length > 0) {
          field.parentId = potentialParents[0].id;
        }
      }
    });

    const createNestedStructure = () => {
      const rootFields: Record<string, any> = {};
      
      const childrenByParent: Record<string, any[]> = {};
      Object.values(fieldMap).forEach(field => {
        const parentId = field.parentId;
        if (parentId) {
          if (!childrenByParent[parentId]) {
            childrenByParent[parentId] = [];
          }
          childrenByParent[parentId].push(field);
        }
      });
      
      const buildFieldStructure = (field: any) => {
        const result: any = {
          ...(field.required && { required: true }),
          type: field.type || 'object',
          ...(field.item && { item: { type: field.item } }),
        };
        
        if (field.type === 'object') {
          const children = childrenByParent[field.id] || [];
          if (children.length > 0) {
            result.fields = {};
            
            children.forEach(child => {
              if (child.name) {
                result.fields[child.name] = buildFieldStructure(child);
              }
            });
          }
        }
        
        return result;
      };
      
      Object.values(fieldMap).forEach(field => {
        if (!field.parentId && field.name) {
          rootFields[field.name] = buildFieldStructure(field);
        }
      });
      
      return rootFields;
    };

    const rootFields = createNestedStructure();

    const json: any = {
      name: schema.name,
      ...(schema.extends &&
        schema.extends.trim() !== '' && { extends: schema.extends }),
      ...(responseStatus && { responseStatus }),
      fields: rootFields,
    };

    return json;
  };

  const schemaJSON = useMemo(
    () => generateSchemaJSON(),
    [schema, selectedTypes, selectedItems, fieldData, responseStatus]
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
    addNestedField,
    addRootField,
    setFieldParent,
    clearChildFields,
    responseStatus,
    setResponseStatus,
  };

  return (
    <NodeSchemaContext.Provider value={value}>
      {children}
    </NodeSchemaContext.Provider>
  );
}

function generateNewFieldId() {
  return `field-${Date.now()}`;
}
