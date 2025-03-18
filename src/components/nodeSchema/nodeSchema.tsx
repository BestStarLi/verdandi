import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Fields from './fields';
import ExtendsPanel from './extendsPanel';
import TypePanel from './typePanel';

interface SchemaField {
  name: string;
  required: boolean;
  type: string;
  item?: string;
  fields?: SchemaField[];
}

interface SchemaDefinition {
  name: string;
  extends: string;
  type: string;
  fields: SchemaField[];
}

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
  const [schema, setSchema] = useState<SchemaDefinition>({
    name: '',
    extends: '',
    type: '',
    fields: [],
  });
  const [showExtendsPanel, setShowExtendsPanel] = useState(false);
  const [showTypePanel, setShowTypePanel] = useState(false);
  const [selectedNode, setSelectedNode] = useState('MongoDoc');
  const [nodeTypes, setNodeTypes] = useState<NodeType[]>([]);

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
    setSchema((prev) => ({ ...prev, name: value }));
    setShowExtendsPanel(false);
    setShowTypePanel(false);
  };

  const handleExtendsSelect = (value: string) => {
    setSchema((prev) => ({ ...prev, extends: value }));
    setShowExtendsPanel(false);
  };

  const handleTypeSelect = (value: string) => {
    setSchema((prev) => ({ ...prev, type: value }));
    setShowTypePanel(false);
  };

  const toggleExtendsPanel = () => {
    setShowExtendsPanel(true);
    setShowTypePanel(false);
  };

  const toggleTypePanel = () => {
    setShowTypePanel(true);
    setShowExtendsPanel(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 m-4 h-full">
      <h1 className="text-2xl font-bold">Node Schema Definition</h1>
      <div className="flex flex-1 flex-row gap-4">
        {/* Left Panel */}
        <div className="flex flex-col justify-between flex-1 basis-2/5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">
                name<span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
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
              selectedType={schema.type}
            />
            <div className="flex gap-4 justify-end mt-auto">
              <Button
                variant="outline"
                className="min-w-[80px] border border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black cursor-pointer"
              >
                Preview
              </Button>
              <Button className="min-w-[80px] bg-black hover:bg-black/90 cursor-pointer">
                Register
              </Button>
            </div>
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
              handleTypeSelect={handleTypeSelect}
              setShowTypePanel={setShowTypePanel}
            />
          )}
        </div>
      </div>
    </div>
  );
}
