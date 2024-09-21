import { useResizeObserver } from '@vueuse/core';
import { debounce, entries } from 'lodash';
import { ref, nextTick, Ref } from 'vue';
import { Table } from 'ant-design-vue'
export function useScrollY(antTableRef: Ref<InstanceType<typeof Table>>) {
  // 计算ant table scroll高度
  const calctableScroll = debounce(
    async function calctableScroll(antTableContainer: HTMLElement) {
      await new Promise((resolve) => setTimeout(resolve, 36));
      const antHeader = antTableContainer.querySelector('.ant-table-header') as HTMLElement;
      if (antHeader && antTableContainer.offsetHeight && antHeader.offsetHeight) {
        scroll.value.y = antTableContainer.offsetHeight - antHeader.offsetHeight;
      }
      if (antTableContainer.querySelector('.ant-table-content')) {
        const thead = antTableContainer.querySelector('.ant-table-content table thead') as HTMLElement;
        if (antTableContainer.offsetHeight && thead.offsetHeight) {
          scroll.value.y = antTableContainer.offsetHeight - thead.offsetHeight;
        }
      }
    },
    100,
    { leading: false },
  );
  const scroll = ref({
    y: undefined,
  });
  useResizeObserver(antTableRef, (entries) => {
    nextTick(() => {
      const antTableContainer = entries.filter((entry) => entry.target.classList.contains('ant-table-wrapper'))[0];
      if (antTableContainer) {
        calctableScroll(antTableContainer.target as HTMLElement);
      }
    });
  });

  return scroll;
}
