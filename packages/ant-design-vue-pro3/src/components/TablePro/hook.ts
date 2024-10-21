import { useResizeObserver } from '@vueuse/core';
import { debounce } from 'lodash'
import { ref, nextTick, type Ref, computed } from 'vue';
import { Table } from 'ant-design-vue';

export function useTableHeaderHeight(antTableRef: Ref<InstanceType<typeof Table>>) {
  const antTable = () => antTableRef.value?.$el?.querySelector('.ant-table');
  const header1 = computed(() => {
    return antTable()?.querySelector('.ant-table-header') as HTMLElement;
  })
  const header2 = computed(() => {
    return antTable()?.querySelector('.ant-table-thead') as HTMLElement;
  });
  const height = ref(0);
  useResizeObserver(header1, ([ev]) => {
    if (ev) {
      const { target } = ev;
      // @ts-expect-error
      height.value = target.offsetHeight;
    }
  });
  useResizeObserver(header2, ([ev]) => {
    if (ev) {
      const { target } = ev;
      // @ts-expect-error
      height.value = target.offsetHeight;
    }
  });
  return height;
}

export function useTableContentHeight(antTableRef: Ref<InstanceType<typeof Table>>) {
  const content = computed(() => {
    // no scroll
    return antTableRef.value?.$el?.querySelector('.ant-table-content .ant-table-tbody') as HTMLElement;
  })
  const content2 = computed(() => {
    // have scroll
    return antTableRef.value?.$el?.querySelector('.ant-table-body table') as HTMLElement;
  })

  const height = ref(0);
  useResizeObserver(content, ([ev]) => {
    if (ev) {
      const { target } = ev;
      // @ts-expect-error
      height.value = target.offsetHeight;
    }
  });
  useResizeObserver(content2, ([ev]) => {
    if (ev) {
      const { target } = ev;
      // @ts-expect-error
      height.value = target.offsetHeight;
    }
  });
  return height;
}
