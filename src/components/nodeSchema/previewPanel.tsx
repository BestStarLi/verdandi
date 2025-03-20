'use client';

import { Button } from '@/components/ui/button';
import { useNodeSchema } from './nodeSchemaContext';

export default function PreviewPanel({ onClose }: { onClose: () => void }) {
  const { schemaJSON } = useNodeSchema();

  return (
    <div>
      <div className="flex h-full flex-col bg-black rounded-lg border p-4">
        <div className="text-white flex-1 mb-4 p-4">
          <pre className="text-sm">{JSON.stringify(schemaJSON, null, 2)}</pre>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            className="min-w-[80px] border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black cursor-pointer"
            onClick={onClose}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}
