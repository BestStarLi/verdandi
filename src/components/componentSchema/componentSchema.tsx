import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import RESTFUL from './restful/restful';
import GRPC from './grpc';
import LOCAL from './local';
import RUNTIME from './runtime';
import NewParamsPanel from './restful/newParamsPanel';
import NewStatusPanel from './restful/newStatusPanel';

export default function ComponentSchema() {
  const [componentType, setComponentType] = useState('restful'); //暂设默认显示方便看代码效果
  const [activePanel, setActivePanel] = useState<'params' | 'status' | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleParamAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  const handleStatusAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleShowParamsPanel = () => {
    setActivePanel('params');
  };

  const handleShowStatusPanel = () => {
    setActivePanel('status');
  };

  const handleClosePanel = () => {
    setActivePanel(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 m-4 h-full">
      <h1 className="text-2xl font-bold">Component Definition</h1>
      <div className="flex flex-1 flex-row gap-4">
        {/* Left Panel */}
        <div className="flex flex-col flex-1 basis-2/5">
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-15rem)]">
            <div className="space-y-2">
              <Label htmlFor="componenttype" className="text-base">
                component type
              </Label>
              <Select
                onValueChange={(value) => setComponentType(value)}
                value={componentType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="grpc">GRPC</SelectItem>
                    <SelectItem value="local">LOCAL</SelectItem>
                    <SelectItem value="restful">RESTFUL</SelectItem>
                    <SelectItem value="runtime">RUNTIME</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            {componentType === 'grpc' && <GRPC />}
            {componentType === 'local' && <LOCAL />}
            {componentType === 'restful' && <RESTFUL setShowNewParamsPanel={handleShowParamsPanel} setShowNewStatusPanel={handleShowStatusPanel} refreshTrigger={refreshTrigger} />}
            {componentType === 'runtime' && <RUNTIME />}
          </div>
          <div className="flex gap-4 justify-end mt-4">
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

        {/* Right Panel */}
        <div className="flex-1 basis-3/5">
          {activePanel === 'params' && (
            <NewParamsPanel 
              onClose={handleClosePanel} 
              onSuccess={handleParamAdded} 
            />
          )}
          {activePanel === 'status' && (
            <NewStatusPanel 
              onClose={handleClosePanel} 
              onSuccess={handleStatusAdded} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
