import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown } from 'lucide-react';

interface RequestParam {
  _id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface RequestParamsProps {
  loading: boolean;
  requestParams: RequestParam[];
  selectedRequestParams: string[];
  setSelectedRequestParams: (params: string[]) => void;
  setShowNewParamsPanel: (show: boolean) => void;
}

export default function RequestParams({
  loading,
  requestParams,
  selectedRequestParams,
  setSelectedRequestParams,
  setShowNewParamsPanel,
}: RequestParamsProps) {
  const [isParamsExpanded, setIsParamsExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="name" className="text-base">
        request params
      </Label>
      <Button
        variant="outline"
        className="w-full justify-between cursor-pointer mb-1"
        onClick={() => setIsParamsExpanded(!isParamsExpanded)}
      >
        <span>
          {selectedRequestParams.length > 0
            ? `${selectedRequestParams.length} parameters selected`
            : 'Please select request parameters'}
        </span>
        <ChevronDown
          className={`h-4 w-4 opacity-50 transition-transform ${
            isParamsExpanded ? 'rotate-180' : ''
          }`}
        />
      </Button>
      {isParamsExpanded && (
        <ScrollArea className="h-64 w-full rounded-md border">
          <div className="m-4 mb-3">
            {loading ? (
              <div className="text-center py-4">loading...</div>
            ) : requestParams.length === 0 ? (
              <div className="text-center py-4">
                No available request parameters
              </div>
            ) : (
              requestParams.map((param) => (
                <div key={param._id} className="mb-3">
                  <Button
                    variant={
                      selectedRequestParams.includes(param._id)
                        ? 'default'
                        : 'outline'
                    }
                    className="w-full justify-start text-left py-3 h-auto min-h-[60px] box-border border border-solid"
                    style={{
                      borderWidth: '1px',
                      minHeight: '60px',
                      padding: '0.75rem 1rem',
                      transition: 'background-color 0.2s, color 0.2s',
                      transitionProperty: 'background-color, color',
                    }}
                    onClick={() => {
                      setSelectedRequestParams(
                        selectedRequestParams.includes(param._id)
                          ? selectedRequestParams.filter((id) => id !== param._id)
                          : [...selectedRequestParams, param._id]
                      );
                    }}
                  >
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedRequestParams.includes(param._id)}
                        className="mr-2"
                        onCheckedChange={(checked) => {
                          setSelectedRequestParams(
                            checked
                              ? [...selectedRequestParams, param._id]
                              : selectedRequestParams.filter((id) => id !== param._id)
                          );
                        }}
                      />
                      <div>
                        <div className="font-medium">{param.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {param.type} {param.required && '(required)'} -{' '}
                          {param.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-center mb-3">
            <Button
              className="flex items-center cursor-pointer"
              onClick={() => setShowNewParamsPanel(true)}
            >
              Add New Param<span className="text-xl">+</span>
            </Button>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
