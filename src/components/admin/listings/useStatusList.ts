import { useState } from "react";
import { useResource, type Resource } from "@/hooks/useResource";
import type { ListParams, ListResponse, PublishStatus } from "@/types/api";

export type StatusFilter = "all" | PublishStatus;

export const PAGE_SIZE = 50;

interface StatusList<T> {
  filter: StatusFilter;
  setFilter: (filter: StatusFilter) => void;
  page: number;
  setPage: (page: number) => void;
  resource: Resource<ListResponse<T>>;
}

export function paramsFor(filter: StatusFilter, page: number): ListParams {
  return {
    ...(filter === "all" ? {} : { status: filter }),
    skip: page * PAGE_SIZE,
    limit: PAGE_SIZE,
  };
}

export function useStatusList<T>(fetch: (params: ListParams) => Promise<ListResponse<T>>): StatusList<T> {
  const [filter, setFilterState] = useState<StatusFilter>("all");
  const [page, setPage] = useState(0);
  const resource = useResource(() => fetch(paramsFor(filter, page)), [filter, page]);

  const setFilter = (next: StatusFilter) => {
    setFilterState(next);
    setPage(0);
  };

  return { filter, setFilter, page, setPage, resource };
}
