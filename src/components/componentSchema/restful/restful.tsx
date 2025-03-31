import { CircleHelp, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RequestParams from './requestParams';

interface RequestParam {
  _id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface ResponseStatus {
  _id: string;
  code: number;
  schema: string;
  description: string;
  params: {
    name: string;
    type: string;
    description: string;
  }[];
}

interface RESTFULProps {
  setShowNewParamsPanel: (show: boolean) => void;
  setShowNewStatusPanel: (show: boolean) => void;
  refreshTrigger?: number;
}

export default function RESTFUL({
  setShowNewParamsPanel,
  setShowNewStatusPanel,
  refreshTrigger = 0,
}: RESTFULProps) {
  const [requestParams, setRequestParams] = useState<RequestParam[]>([]);
  const [responseStatus, setResponseStatus] = useState<ResponseStatus[]>([]);
  const [selectedRequestParams, setSelectedRequestParams] = useState<string[]>([]);
  const [selectedResponseStatus, setSelectedResponseStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isStatusExpanded, setIsStatusExpanded] = useState<boolean>(false);

  useEffect(() => {
    const fetchRequestParams = async () => {
      try {
        const response = await fetch('http://localhost:8000/request-params');
        const data = await response.json();
        setRequestParams(data.data);
      } catch (error) {
        console.error('Failed to get request parameters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestParams();
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchResponseStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/response-status');
        const data = await response.json();
        setResponseStatus(data.data);
      } catch (error) {
        console.error('Failed to get response status:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResponseStatus();
  }, [refreshTrigger]);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base">
          name<span className="text-destructive">*</span>
        </Label>
        <Input id="name" required className="w-full" placeholder="Required" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="api" className="text-base">
          api<span className="text-destructive">*</span>
          <HoverCard>
            <HoverCardTrigger>
              <span>
                <CircleHelp className="w-4 h-4" />
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-105">
              The input API should have an identifier, such as &#123; &#125;.
              <br />
              e.g. http://127.0.0.1:8000/api/v0/node/
              <span className="text-red-500">{`{id}`}</span>
            </HoverCardContent>
          </HoverCard>
        </Label>
        <Input id="api" required className="w-full" placeholder="Required" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="componenttype" className="text-base">
          type
        </Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="get">GET</SelectItem>
              <SelectItem value="post">POST</SelectItem>
              <SelectItem value="put">PUT</SelectItem>
              <SelectItem value="delete">DELETE</SelectItem>
              <SelectItem value="patch">PATCH</SelectItem>
              {/* <SelectItem value="head">HEAD</SelectItem>
              <SelectItem value="options">OPTIONS</SelectItem>
              <SelectItem value="trace">TRACE</SelectItem>
              <SelectItem value="connect">CONNECT</SelectItem> */}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base">
          description
        </Label>
        <Input id="description" required className="w-full" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="componenttype" className="text-base">
          request schema
        </Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="none">none</SelectItem>
              <SelectItem value="formdata">multipart/form-data</SelectItem>
              <SelectItem value="xwwwformurlencoded">
                x-www-form-urlencoded
              </SelectItem>
              <SelectItem value="textplain">text/plain</SelectItem>
              <SelectItem value="json">application/json</SelectItem>
              <SelectItem value="applicationxml">application/xml</SelectItem>
              <SelectItem value="octetstream">
                application/octet-stream
              </SelectItem>
              <SelectItem value="protobuf">application/protobuf</SelectItem>
              <SelectItem value="graphql">application/graphql</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label className="text-base">deprecated</Label>
          <Checkbox className="cursor-pointer" />
        </div>
      </div>

      {/* request params */}
      <RequestParams
        loading={loading}
        requestParams={requestParams}
        selectedRequestParams={selectedRequestParams}
        setSelectedRequestParams={setSelectedRequestParams}
        setShowNewParamsPanel={setShowNewParamsPanel}
      />

      {/* response status */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base">
          response status
        </Label>
        <Button
          variant="outline"
          className="w-full justify-between cursor-pointer mb-1"
          onClick={() => setIsStatusExpanded(!isStatusExpanded)}
        >
          <span>
            {selectedResponseStatus
              ? `Status Code: ${responseStatus.find(status => status._id === selectedResponseStatus)?.code || ''}`
              : 'please select response status'}
          </span>
          <ChevronDown
            className={`h-4 w-4 opacity-50 transition-transform ${
              isStatusExpanded ? 'rotate-180' : ''
            }`}
          />
        </Button>
        {isStatusExpanded && (
          <ScrollArea className="h-64 w-full rounded-md border">
            <div className="m-4 mb-3">
              {loading ? (
                <div className="text-center py-4">loading...</div>
              ) : responseStatus.length === 0 ? (
                <div className="text-center py-4">
                  No available response status
                </div>
              ) : (
                responseStatus.map((status) => (
                  <div key={status._id} className="mb-3">
                    <Button
                      variant={
                        selectedResponseStatus === status._id
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
                        setSelectedResponseStatus(
                          selectedResponseStatus === status._id ? '' : status._id
                        );
                      }}
                    >
                      <div className="flex items-center">
                        <Checkbox
                          checked={selectedResponseStatus === status._id}
                          className="mr-2"
                          onCheckedChange={(checked) => {
                            setSelectedResponseStatus(
                              checked ? status._id : ''
                            );
                          }}
                        />
                        <div>
                          <div className="font-medium">Code: {status.code}</div>
                          <div className="text-xs text-muted-foreground">
                            {status.schema} - {status.description}
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
                onClick={() => setShowNewStatusPanel(true)}
              >
                Add New Status<span className="text-xl">+</span>
              </Button>
            </div>
          </ScrollArea>
        )}
      </div>
    </>
  );
}
