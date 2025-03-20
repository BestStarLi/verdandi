import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useState } from 'react';
import { Hexagon, Workflow, Pencil } from 'lucide-react';

const data = {
  navMain: [
    {
      title: 'Node Schema Definition',
      icon: Hexagon,
      items: [
        {
          title: 'Edit Node Schema',
          logo: Pencil,
          url: '#',
          isActive: true,
        },
      ],
    },
    {
      title: 'Component Definition',
      icon: Workflow,
      items: [
        {
          title: 'Edit Component Schema',
          logo: Pencil,
          url: '#',
          isActive: false,
        },
      ],
    },
  ],
};

export function AppSidebar({
  onItemSelect,
  ...props
}: { onItemSelect: (item: string) => void } & React.ComponentProps<
  typeof Sidebar
>) {
  const [activeItem, setActiveItem] = useState<string | null>(
    'Edit Node Schema' //暂设默认显示方便看代码效果
  );

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    onItemSelect(item);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-black">
        <div className="flex justify-center h-12 items-center">
          <h2 className="text-2xl font-bold text-white">Definition Editor</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>
              <group.icon className="mr-2" />
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeItem === item.title}
                      onClick={() => handleItemClick(item.title)}
                    >
                      <a href={item.url}>
                        <span className="ml-3">
                          <item.logo className="w-4 h-4" />
                        </span>
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
