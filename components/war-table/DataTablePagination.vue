<script setup lang="ts">
  import type { Table } from '@tanstack/vue-table';
  import { Icon } from '@iconify/vue';

  import { Button } from '@/components/ui/button';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import type { TimeEntry } from '~/types/time-entry';

  interface DataTablePaginationProps {
    table: Table<TimeEntry>;
  }
  defineProps<DataTablePaginationProps>();
</script>

<template>
  <div class="flex flex-col md:flex-row items-center justify-between px-2">
    <div class="flex-1 text-sm text-muted-foreground mb-2">
      <!-- {{ table.getFilteredSelectedRowModel().rows.length }} of -->
      <!-- {{ table.getFilteredRowModel().rows.length }} row(s) selected. -->
      {{ table.getFilteredRowModel().rows.length }} row(s) entries.
    </div>
    <div class="flex flex-col md:flex-row items-center gap-x-6 gap-y-4 lg:gap-x-8">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Rows per page</p>
        <Select
          :model-value="`${table.getState().pagination.pageSize}`"
          @update:model-value="(value: string) => table.setPageSize(Number(value))"
        >
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="`${table.getState().pagination.pageSize}`" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem
              v-for="pageSize in [10, 20, 30, 40, 50]"
              :key="pageSize"
              :value="`${pageSize}`"
            >
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {{ table.getState().pagination?.pageIndex + 1 }} of
        {{ table.getPageCount() }}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="hidden h-8 w-8 p-0 lg:flex"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        >
          <span class="sr-only">Go to first page</span>
          <Icon icon="radix-icons:double-arrow-left" class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <span class="sr-only">Go to previous page</span>
          <Icon icon="radix-icons:chevron-left" class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <span class="sr-only">Go to next page</span>
          <Icon icon="radix-icons:chevron-right" class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="hidden h-8 w-8 p-0 lg:flex"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <span class="sr-only">Go to last page</span>
          <Icon icon="radix-icons:double-arrow-right" class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
