export default function findSelfList<T extends { children?: T[] }>(
  data: T[],
  key: string | number,
  callback: any,
  _filed = 'key',
) {
  data?.forEach((item, index) => {
    if (item[_filed] === key) {
      return callback(item, index, data);
    }
    if (item.children) {
      return findSelfList(item.children, key, callback);
    }
  });
}
