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
import { NodeSchemaProvider } from './nodeSchema/nodeSchemaContext';

export default function Page() {
  const [activeComponent, setActiveComponent] = useState<string>(
    'Edit Node Schema'
  ); //暂设默认显示方便看代码效果

  const handleItemSelect = (item: string) => {
    setActiveComponent(item);
  };

  return (
    <>
      <SidebarProvider>
        <AppSidebar onItemSelect={handleItemSelect} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
            <div className="flex items-center">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div>
                {activeComponent === 'Edit Node Schema' &&
                  'Node Schema Definition Editor'}
                {activeComponent === 'Edit Component Schema' &&
                  'Component Definition Editor'}
              </div>
            </div>
            <div className='flex items-center'>
              <a href="http://geomodeling.njnu.edu.cn" target="_blank" rel="noopener noreferrer">
                <img src="./logo/OpenGMS01.png" alt="" className='w-39 h-28'/>
              </a>
            </div>
          </header>
          {activeComponent === 'Edit Node Schema' && (
            <NodeSchemaProvider>
              <NodeSchemaDefinition />
            </NodeSchemaProvider>
          )}
          {activeComponent === 'Edit Component Schema' && <ComponentSchema />}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
