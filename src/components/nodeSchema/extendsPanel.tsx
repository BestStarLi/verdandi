import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// interface SchemaField {
//   name: string;
//   required: boolean;
//   type: string;
//   item?: string;
//   fields?: SchemaField[];
// }

// interface SchemaDefinition {
//   name: string;
//   extends: string;
//   fields: SchemaField[];
// }

interface NodeType {
  name: string;
  schema: {
    name: string;
    fields: {
      [key: string]: { type: string; required?: boolean };
    };
  };
}

interface ExtendsPanelProps {
  nodeTypes: NodeType[];
  selectedNode: string;
  setSelectedNode: (value: string) => void;
  handleExtendsSelect: (value: string) => void;
  setShowExtendsPanel: (value: boolean) => void;
}

export default function ExtendsPanel({
  nodeTypes,
  selectedNode,
  setSelectedNode,
  handleExtendsSelect,
  setShowExtendsPanel,
}: ExtendsPanelProps) {
  return (
    <div className="flex h-full bg-white rounded-lg border p-4">
      <div className="pr-4 space-y-1 flex-1">
        {nodeTypes.map((type) => (
          <Button
            key={type.name}
            variant={selectedNode === type.name ? 'default' : 'ghost'}
            className={`w-full justify-start cursor-pointer${
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
            className="min-w-[80px] border border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black cursor-pointer"
            onClick={() => setShowExtendsPanel(false)}
          >
            No
          </Button>
          <Button
            className="min-w-[80px] bg-black hover:bg-black/90 cursor-pointer"
            onClick={() => handleExtendsSelect(selectedNode)}
          >
            Yes
          </Button>
        </div>
      </div>
      <Separator orientation="vertical" className="h-full" />
      <div className="pl-4 flex-[2]">
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
  );
}
