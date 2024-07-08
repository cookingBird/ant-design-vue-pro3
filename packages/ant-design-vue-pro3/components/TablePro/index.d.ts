import { type TableProps } from 'ant-design-vue';

export type TablePro = Omit<TableProps, 'scroll'> & {
  columns: TableProps['columns'] &
    Partial<{
      slotIs: string;
      slotProps: string;
      wrapperProps: Record<string, any>;
    }>;
  dataSource: TableProps['dataSource'];
  autoFitHeight?: boolean;
  styled?: 'default' | 'transparent';
  scroll?: { x: number; y: number };
};
