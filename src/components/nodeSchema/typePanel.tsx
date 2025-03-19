'use client';

import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface NodeType {
  name: string;
  schema: {
    name: string;
    fields: {
      [key: string]: { type: string; required?: boolean };
    };
  };
}

interface TypePanelProps {
  nodeTypes: NodeType[];
  selectedNode: string;
  setSelectedNode: (value: string) => void;
  setShowTypePanel: (value: boolean) => void;
  handleTypeSelect: (value: string) => void;
}

const simpleTypes = ['int', 'float64', 'bool', 'string'];
const complexTypes = ['map', 'array', 'object'];

export default function TypePanel({
  nodeTypes,
  selectedNode,
  setSelectedNode,
  setShowTypePanel,
  handleTypeSelect,
}: TypePanelProps) {
  const [showSchema, setShowSchema] = useState(false);
  const [isNodeTypeSelected, setIsNodeTypeSelected] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      const isSchema = nodeTypes.some((type) => type.name === selectedNode);
      setIsNodeTypeSelected(isSchema);
      setShowSchema(isSchema);
    } else {
      setIsNodeTypeSelected(false);
      setShowSchema(false);
    }
  }, [selectedNode, nodeTypes]);

  const handleNodeTypeClick = (type: string) => {
    setSelectedNode(type);
    setShowSchema(true);
    setIsNodeTypeSelected(true);
  };

  const handleSimpleTypeClick = (type: string) => {
    setSelectedNode(type);
    setShowSchema(false);
    setIsNodeTypeSelected(false);
  };

  const handleComplexTypeClick = (type: string) => {
    setSelectedNode(type);
    setShowSchema(false);
    setIsNodeTypeSelected(false);
  };

  return (
    <div className="flex h-full bg-white rounded-lg border p-4">
      <div className="pr-4 space-y-1 flex-1">
        <h2 className="text-lg font-bold">Simple</h2>
        <div className="flex flex-col space-y-2">
          {simpleTypes.map((type) => (
            <Button
              key={type}
              variant={
                !isNodeTypeSelected && selectedNode === type
                  ? 'default'
                  : 'ghost'
              }
              className={`w-full justify-start cursor-pointer ${
                !isNodeTypeSelected && selectedNode === type
                  ? 'bg-black text-white hover:bg-black/90'
                  : ''
              }`}
              onClick={() => handleSimpleTypeClick(type)}
            >
              {type}
            </Button>
          ))}
        </div>
        <Separator />
        <h2 className="text-lg font-bold">Complex</h2>
        <div className="flex flex-col space-y-2">
          {complexTypes.map((type) => (
            <Button
              key={type}
              variant={
                !isNodeTypeSelected && selectedNode === type
                  ? 'default'
                  : 'ghost'
              }
              className={`w-full justify-start cursor-pointer ${
                !isNodeTypeSelected && selectedNode === type
                  ? 'bg-black text-white hover:bg-black/90'
                  : ''
              }`}
              onClick={() => handleComplexTypeClick(type)}
            >
              {type}
            </Button>
          ))}
        </div>
        <Separator />
        <h2 className="text-lg font-bold">Schema</h2>
        {nodeTypes.map((type) => (
          <Button
            key={type.name}
            variant={
              isNodeTypeSelected && selectedNode === type.name
                ? 'default'
                : 'ghost'
            }
            className={`w-full justify-start cursor-pointer ${
              isNodeTypeSelected && selectedNode === type.name
                ? 'bg-black text-white hover:bg-black/90'
                : ''
            }`}
            onClick={() => handleNodeTypeClick(type.name)}
          >
            {type.name}
          </Button>
        ))}
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            className="min-w-[80px] border border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black cursor-pointer"
            onClick={() => setShowTypePanel(false)}
          >
            No
          </Button>
          <Button
            className="min-w-[80px] bg-black hover:bg-black/90 cursor-pointer"
            onClick={() => {
              handleTypeSelect(selectedNode);
              setShowTypePanel(false);
            }}
          >
            Yes
          </Button>
        </div>
      </div>
      <Separator orientation="vertical" className="h-full" />
      <div className="pl-4 flex-[2]">
        {showSchema && (
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
        )}
      </div>
    </div>
  );
}
