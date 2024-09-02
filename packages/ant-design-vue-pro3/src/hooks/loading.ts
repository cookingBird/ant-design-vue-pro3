import { ref } from "vue";

export default function useLoading() {
  const loading = ref(false);
  const cancel = () => (loading.value = false);
  return {
    loading,
    done: cancel,
  };
}
