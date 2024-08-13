export default function getTreeTravel<T extends { children?: T[]; child?: T[] }>(
  hooks: {
    every: (node: T, parent: T | undefined, index: number) => void;
  },
  childrenKey = 'children',
) {
  const { every } = hooks;
  function travel(data: T, parent: T | undefined, index: number) {
    every(data, parent, index);
    // @ts-expect-error
    if (Array.isArray(data[childrenKey])) {
      // @ts-expect-error
      data[childrenKey].forEach((item, index) => {
        travel(item, data, index);
      });
    }
  }
  return function travelList(data: T[]) {
    data.forEach((node, index) => travel(node, undefined, index));
  };
}
