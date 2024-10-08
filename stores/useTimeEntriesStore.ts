import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useErrorHandler } from '@/composables/useErrorHandler';
import type { ApiResponse } from '@/types/api';
import type { TimeEntry } from '@/types/time-entry';

export const useTimeEntriesStore = defineStore('timeEntries', () => {
  const { handleError } = useErrorHandler();
  const timeEntries = ref<TimeEntry[]>([]);
  const loading = ref(false);
  const error = ref<any>(null);

  /**
   * Fetches time entries from the server.
   *
   * @param query - The query to be sent with the request.
   */
  const fetchTimeEntries = async (query: any) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<ApiResponse>('/api/v1/clockify/time-entries', {
        method: 'GET',
        query: query,
      });

      // console.log('response :>> ', response);

      if (response.success) {
        timeEntries.value = response.data || [];
      } else {
        throw new Error(response.message || 'Failed to fetch the time entries data');
      }
    } catch (err: any) {
      const processedError: any = handleError(err);

      error.value = processedError;
    } finally {
      loading.value = false;
    }
  };

  return {
    timeEntries,
    loading,
    error,
    fetchTimeEntries,
  };
});
