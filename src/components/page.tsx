import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import NodeSchemaDefinition from './nodeSchema/nodeSchema';
import ComponentSchema from './componentSchema/componentSchema';
import { useState } from 'react';

export default function Page() {
  const [activeComponent, setActiveComponent] = useState<string>(
    'Edit Component Schema'
  ); //暂设默认显示方便看代码效果

  const handleItemSelect = (item: string) => {
    setActiveComponent(item);
  };

  return (
    <>
      <SidebarProvider>
        <AppSidebar onItemSelect={handleItemSelect} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div>
              {activeComponent === 'Edit Node Schema' && 'Node Schema Definition Editor'}
              {activeComponent === 'Edit Component Schema' && 'Component Definition Editor'}
            </div>
          </header>
          {activeComponent === 'Edit Node Schema' && <NodeSchemaDefinition />}
          {activeComponent === 'Edit Component Schema' && <ComponentSchema />}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
