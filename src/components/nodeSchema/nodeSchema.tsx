import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Separator } from '@/components/ui/separator';
import Fields from './fields';

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

// const nodeTypes = [
//   {
//     name: 'MongoDoc',
//     schema: {
//       name: 'MongoDocument',
//       fields: {
//         _id: { type: 'string' },
//         name: { type: 'string', required: true },
//       },
//     },
//   },
//   {
//     name: 'BaseNode',
//     schema: {
//       name: 'BaseNode',
//       fields: {
//         id: { type: 'string' },
//         type: { type: 'string', required: true },
//       },
//     },
//   },
//   {
//     name: 'SumNode',
//     schema: {
//       name: 'SumNode',
//       fields: {
//         value: { type: 'number' },
//         items: { type: 'array', required: true },
//         value1: { type: 'number' },
//         items1: { type: 'array', required: true },
//         value2: { type: 'number' },
//         items2: { type: 'array', required: true },
//         value3: { type: 'number' },
//         items3: { type: 'array', required: true },
//         value4: { type: 'number' },
//         items4: { type: 'array', required: true },
//       },
//     },
//   },
// ];

export default function NodeSchemaDefinition() {
  const [schema, setSchema] = useState<SchemaDefinition>({
    name: '',
    extends: 'MongoDoc',
    fields: [],
  });
  const [showExtendsPanel, setShowExtendsPanel] = useState(false);
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
  };

  const handleExtendsSelect = (value: string) => {
    setSchema((prev) => ({ ...prev, extends: value }));
    setShowExtendsPanel(false);
  };

  const toggleExtendsPanel = () => {
    if (!showExtendsPanel) {
      setShowExtendsPanel(true);
      setSelectedNode(schema.extends);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 m-4">
      <h1 className="text-2xl font-bold">Node Schema Definition</h1>
      <div className="flex flex-1 flex-row gap-4">
        {/* Left Panel */}
        <div
          className="flex flex-col justify-between flex-1"
          style={{ flex: 2 }}
        >
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
                className="w-full justify-between"
                onClick={toggleExtendsPanel}
              >
                {schema.extends}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </div>
            <Fields />
          </div>
          <div className="flex gap-4 mt-auto justify-end">
            <Button
              variant="outline"
              className="min-w-[80px] border border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black"
            >
              Preview
            </Button>
            <Button className="min-w-[80px] bg-black hover:bg-black/90">
              Register
            </Button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1" style={{ flex: 3 }}>
          {showExtendsPanel && (
            <div className="flex h-full bg-white rounded-lg border p-4">
              <div className="pr-4 space-y-1" style={{ flex: 1 }}>
                {nodeTypes.map((type) => (
                  <Button
                    key={type.name}
                    variant={selectedNode === type.name ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      selectedNode === type.name
                        ? 'bg-black text-white hover:bg-black/90'
                        : ''
                    }`}
                    onClick={() => setSelectedNode(type.name)}
                  >
                    {type.name}
                  </Button>
                ))}
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="min-w-[80px] border border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black"
                    onClick={() => setShowExtendsPanel(false)}
                  >
                    No
                  </Button>
                  <Button
                    className="min-w-[80px] bg-black hover:bg-black/90"
                    onClick={() => handleExtendsSelect(selectedNode)}
                  >
                    Yes
                  </Button>
                </div>
              </div>
              <Separator orientation="vertical" className="h-full" />
              <div className="pl-4" style={{ flex: 2 }}>
                <div className="bg-black rounded-lg p-4 font-mono text-sm">
                  <pre className="text-white">
                    <code>
                      {JSON.stringify(
                        nodeTypes.find((t) => t.name === selectedNode)?.schema,
                        null,
                        2
                      )}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
