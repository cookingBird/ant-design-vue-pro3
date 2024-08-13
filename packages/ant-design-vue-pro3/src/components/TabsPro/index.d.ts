import type { TabsProps, TabPaneProps } from 'ant-design-vue';

export type TabPanePro = TabPaneProps & {
  component: any;
  key?: string;
  tab: string;
};
export type TabsPro = TabsProps & {
  panes: TabPanePro[];
  height?: 'full' | 'auto';
  useRoute?: boolean;
};
