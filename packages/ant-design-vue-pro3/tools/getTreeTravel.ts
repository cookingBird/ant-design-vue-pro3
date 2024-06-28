export default function getTreeTravel<T extends { children?: T[] }>(hooks: {
  every: (node: T, parent: T | undefined, index: number) => void;
}) {
  const { every } = hooks;
  function travel(data: T, parent: T | undefined, index: number) {
    every(data, parent, index);
    if (Array.isArray(data.children)) {
      data.children.forEach((item, index) => {
        travel(item, data, index);
      });
    }
  }
  return function travelList(data: T[]) {
    data.forEach((node, index) => travel(node, undefined, index));
  };
}
