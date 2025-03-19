import { CircleHelp } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
import { ChevronDown } from 'lucide-react';

const tags = Array.from({ length: 6 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

interface RESTFULProps {
  setShowNewParamsPanel: (show: boolean) => void;
}

export default function RESTFUL({ setShowNewParamsPanel }: RESTFULProps) {
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
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base">
          request params
        </Label>
        <Button
          variant="outline"
          className="w-full justify-end cursor-pointer mb-1"
        >
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
        <ScrollArea className="h-64 w-full rounded-md border">
          <div className="m-4 mb-3">
            {tags.map((tag) => (
              <div key={tag} className="text-sm">
                {tag}
                <Separator className="my-3" />
              </div>
            ))}
          </div>
          <div className="flex justify-center mb-3">
            <Button
              className="flex items-center cursor-pointer"
              onClick={() => setShowNewParamsPanel(true)}
            >
              Add New Params<span className="text-xl">+</span>
            </Button>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
