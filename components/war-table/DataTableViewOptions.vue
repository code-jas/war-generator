<script setup lang="ts">
  import type { Table } from '@tanstack/vue-table';
  import { computed } from 'vue';
  import { Icon } from '@iconify/vue';

  import { Button } from '@/components/ui/button';
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import type { TimeEntry } from '~/types/time-entry';
  // import type { TimeEntry } from '~/data/task';

  import { useViewport } from '~/composables/useViewPort';

  const { isMdAndAbove } = useViewport();

  interface DataTableViewOptionsProps {
    table: Table<TimeEntry>;
  }

  const props = defineProps<DataTableViewOptionsProps>();

  const columns = computed(() =>
    props.table
      .getAllColumns()
      .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()),
  );
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm" class="ml-auto flex h-10">
        <Icon icon="radix-icons:mixer-horizontal" class="h-4 w-4" />
        <span v-if="isMdAndAbove" class="ml-2">View</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[150px]">
      <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuCheckboxItem
        v-for="column in columns"
        :key="column.id"
        class="capitalize"
        :checked="column.getIsVisible()"
        @update:checked="(value: any) => column.toggleVisibility(!!value)"
      >
        {{ column.id }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
