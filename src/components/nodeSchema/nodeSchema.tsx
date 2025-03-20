'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Fields from './fields';
import ExtendsPanel from './extendsPanel';
import TypePanel from './typePanel';
import PreviewPanel from './previewPanel';
import { useNodeSchema } from './nodeSchemaContext';

interface NodeType {
  name: string;
  schema: {
    name: string;
    fields: {
      [key: string]: { type: string; required?: boolean };
    };
  };
}

export default function NodeSchemaDefinition() {
  const {
    schema,
    setSchema,
    selectedTypes,
    setSelectedTypes,
    selectedItems,
    setSelectedItems,
    updateName,
  } = useNodeSchema();
  const [showExtendsPanel, setShowExtendsPanel] = useState(false);
  const [showTypePanel, setShowTypePanel] = useState(false);
  const [selectedNode, setSelectedNode] = useState('MongoDoc');
  const [nodeTypes, setNodeTypes] = useState<NodeType[]>([]);
  const [currentFieldId, setCurrentFieldId] = useState<string>('');
  const [isItemSelection, setIsItemSelection] = useState(false);
  const [panelType, setPanelType] = useState<'type' | 'item'>('type');
  const [showPreviewPanel, setShowPreviewPanel] = useState(false);

  useEffect(() => {
    const fetchNodeTypes = async () => {
      try {
        const response = await fetch('http://localhost:8000/node-types');
        const data = await response.json();
        if (data.data) {
          setNodeTypes(data.data);
        }
      } catch (error) {
        console.error('Error fetching node types:', error);
      }
    };

    fetchNodeTypes();
  }, []);

  const handleNameChange = (value: string) => {
    updateName(value);
    setShowExtendsPanel(false);
    setShowTypePanel(false);
  };

  const handleExtendsSelect = (value: string) => {
    setSchema((prev) => ({ ...prev, extends: value }));
    setShowExtendsPanel(false);
  };

  const handleTypeSelect = (value: string) => {
    setSelectedTypes((prev) => ({
      ...prev,
      [currentFieldId]: value,
    }));
    setShowTypePanel(false);
  };

  const handleItemSelect = (value: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [currentFieldId]: value,
    }));
    setShowTypePanel(false);
  };

  const toggleExtendsPanel = () => {
    setShowExtendsPanel(true);
    setShowTypePanel(false);
    setShowPreviewPanel(false);
  };

  const toggleTypePanel = (fieldId: string, isItem = false) => {
    setCurrentFieldId(fieldId);
    setIsItemSelection(isItem);
    setPanelType(isItem ? 'item' : 'type');
    setShowPreviewPanel(false);

    if (isItem) {
      setSelectedNode(selectedItems[fieldId] || '');
    } else {
      setSelectedNode(selectedTypes[fieldId] || '');
    }

    setShowTypePanel(true);
    setShowExtendsPanel(false);
  };

  const handlePreview = () => {
    console.log('Current Schema:', schema);

    setShowPreviewPanel(true);
    setShowExtendsPanel(false);
    setShowTypePanel(false);
  };

  const handleRegister = () => {
    const json = JSON.stringify(schema, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'NodeSchemaDefinition.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 m-4 h-full">
      <h1 className="text-2xl font-bold">Node Schema Definition</h1>
      <div className="flex flex-1 flex-row gap-4">
        {/* Left Panel */}
        <div className="flex flex-col flex-1 basis-2/5">
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-15rem)]">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">
                name<span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Required"
                value={schema.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extends" className="text-base">
                extends
              </Label>
              <Button
                variant="outline"
                className="w-full justify-between cursor-pointer"
                onClick={toggleExtendsPanel}
              >
                {schema.extends || '请选择'}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </div>
            <Fields
              toggleTypePanel={toggleTypePanel}
              selectedTypes={selectedTypes}
              selectedItems={selectedItems}
            />
          </div>
          <div className="flex gap-4 justify-end mt-4">
            <Button
              variant="outline"
              className="min-w-[80px] border border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black cursor-pointer"
              onClick={handlePreview}
            >
              Preview
            </Button>
            <Button
              className="min-w-[80px] bg-black hover:bg-black/90 cursor-pointer"
              onClick={handleRegister}
            >
              Register
            </Button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 basis-3/5">
          {showExtendsPanel && (
            <ExtendsPanel
              nodeTypes={nodeTypes}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              handleExtendsSelect={handleExtendsSelect}
              setShowExtendsPanel={setShowExtendsPanel}
            />
          )}
          {showTypePanel && (
            <TypePanel
              nodeTypes={nodeTypes}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              handleTypeSelect={
                isItemSelection ? handleItemSelect : handleTypeSelect
              }
              setShowTypePanel={setShowTypePanel}
            />
          )}
          {showPreviewPanel && (
            <PreviewPanel onClose={() => setShowPreviewPanel(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
