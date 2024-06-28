export default function useQueryStorage<T>(key: string, fallbackValue: () => T) {
  const router = useRouter();
  const value = computed<T>({
    get() {
      return (router.currentRoute.value.query[key] ?? fallbackValue()) as unknown as T;
    },
    set(val) {
      router.push({
        ...router.currentRoute.value,
        query: {
          ...router.currentRoute.value.query,
          [key]: val as any,
        },
      });
    },
  });
  return {
    getItem(key: string) {
      return router.currentRoute.value.query[key];
    },
    setItem(key: string, val: any) {
      router.push({
        ...router.currentRoute.value,
        query: {
          ...router.currentRoute.value.query,
          [key]: val,
        },
      });
    },
    query: computed(() => router.currentRoute.value.query),
    value,
  };
}
