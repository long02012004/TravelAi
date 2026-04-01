import type { AxiosError, AxiosResponse } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BackendResponse } from "../types";

// Generic hook interface
export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiResponse<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
}

/**
 * Generic hook for fetching data from API
 * @param apiCall - Function that calls the API
 * @param dependencies - Dependencies array to re-run the effect
 * @returns Object containing data, loading, error, and refetch function
 */
export function useApi<T>(
  apiCall: () => Promise<{ data: { DT: T } }>,
): UseApiResponse<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await apiCall();
      setState({ data: response.data.DT, loading: false, error: null });
    } catch (err) {
      const error = err as AxiosError;
      setState({
        data: null,
        loading: false,
        error: error?.message || "Failed to fetch data",
      });
    }
  }, [apiCall]);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) setState({ data: null, loading: true, error: null });
      try {
        const response = await apiCall();
        if (isMounted) {
          setState({ data: response.data.DT, loading: false, error: null });
        }
      } catch (err) {
        if (isMounted && !controller.signal.aborted) {
          const error = err as AxiosError;
          setState({
            data: null,
            loading: false,
            error: error?.message || "Failed to fetch data",
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [apiCall]);

  return { ...state, refetch };
}

/**
 * Hook for mutations (POST, PATCH, DELETE)
 * @returns Object with mutate function and state
 */
export interface UseMutationResponse<T, E = unknown> {
  mutate: (args: E) => Promise<T | null>;
  data: T | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

type MutationResponse<T> = { data: { DT: T } } | AxiosResponse<{ DT: T }>;

type MutationFn<T, E> = (args: E) => Promise<MutationResponse<T>>;

export function useMutation<T, E = unknown>(
  mutationFn: MutationFn<T, E>,
): UseMutationResponse<T, E> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (args: E) => {
      setState({ data: null, loading: true, error: null });
      try {
        const response = await mutationFn(args);

        const isAxiosResponse = (
          value: unknown,
        ): value is AxiosResponse<BackendResponse<T>> =>
          typeof value === "object" &&
          value !== null &&
          "status" in value &&
          "data" in value;

        if (isAxiosResponse(response)) {
          const apiData = response.data;

          if (apiData.EC !== 0) {
            throw new Error(
              apiData.EM || "Mutation returned error from server",
            );
          }

          if (apiData.DT === undefined || apiData.DT === null) {
            throw new Error("Mutation returned invalid payload");
          }

          setState({ data: apiData.DT, loading: false, error: null });
          return apiData.DT;
        }

        const rawData = (response as { data: { DT: T } }).data?.DT;

        if (rawData === undefined || rawData === null) {
          throw new Error("Mutation returned invalid payload");
        }

        setState({ data: rawData, loading: false, error: null });
        return rawData;
      } catch (err) {
        const error = err as AxiosError;
        const errorMessage = error?.message || "Failed to perform action";
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        return null;
      }
    },
    [mutationFn],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { mutate, ...state, reset };
}

/**
 * Hook for pagination
 * @param apiCall - Function that calls the paginated API
 * @returns Object with paginated data and pagination functions
 */
export interface UsePaginationResponse<T> extends UseApiState<T[]> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  goToPage: (page: number) => Promise<void>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
}

export function usePagination<T>(
  apiCall: (
    skip: number,
    limit: number,
  ) => Promise<{
    data: { DT: T[]; total?: number };
  }>,
  pageSize = 10,
): UsePaginationResponse<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchPage = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);
      try {
        const skip = (page - 1) * pageSize;
        const response = await apiCall(skip, pageSize);
        setData(response.data.DT);
        if (response.data.total !== undefined) {
          setTotalItems(response.data.total);
        }
        setCurrentPage(page);
      } catch (err) {
        const error = err as AxiosError;
        setError(error?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    },
    [apiCall, pageSize],
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const goToPage = useCallback(
    async (page: number) => {
      const totalPages = Math.ceil(totalItems / pageSize);
      if (page >= 1 && page <= totalPages) {
        await fetchPage(page);
      }
    },
    [fetchPage, totalItems, pageSize],
  );

  const nextPage = useCallback(async () => {
    const totalPages = Math.ceil(totalItems / pageSize);
    if (currentPage < totalPages) {
      await fetchPage(currentPage + 1);
    }
  }, [fetchPage, currentPage, totalItems, pageSize]);

  const prevPage = useCallback(async () => {
    if (currentPage > 1) {
      await fetchPage(currentPage - 1);
    }
  }, [fetchPage, currentPage]);

  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
  };
}

/**
 * Hook for handling form submission with API call
 */
export interface UseFormMutationResponse<
  T,
  E = unknown,
> extends UseMutationResponse<T, E> {
  isSubmitting: boolean;
  success: boolean;
}

export function useFormMutation<T, E = unknown>(
  mutationFn: (args?: E) => Promise<{ data: { DT: T } }>,
): UseFormMutationResponse<T, E> {
  const [success, setSuccess] = useState(false);
  const { mutate, data, loading, error, reset } = useMutation(mutationFn);

  const submitForm = useCallback(
    async (args?: E) => {
      setSuccess(false);
      const result = await mutate(args);
      if (result) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
      return result;
    },
    [mutate],
  );

  return {
    mutate: submitForm,
    data,
    loading,
    error,
    reset,
    isSubmitting: loading,
    success,
  };
}

/**
 * Hook for search with debounce
 */
export interface UseSearchResponse<T> extends UseApiState<T[]> {
  search: (keyword: string) => void;
  results: T[];
}

export function useSearch<T>(
  searchFn: (keyword: string) => Promise<{ data: { DT: T[] } }>,
  debounceDelay = 500,
): UseSearchResponse<T> {
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const search = useCallback(
    (keyword: string) => {
      if (!keyword.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for debounce
      timeoutRef.current = setTimeout(() => {
        setLoading(true);
        setError(null);

        searchFn(keyword)
          .then((response) => {
            setResults(response.data.DT);
            setLoading(false);
          })
          .catch((err) => {
            const error = err as AxiosError;
            setError(error?.message || "Search failed");
            setLoading(false);
          });
      }, debounceDelay);
    },
    [searchFn, debounceDelay],
  );

  return {
    data: results,
    results,
    loading,
    error,
    search,
  };
}

/**
 * Hook for caching API responses
 */
export function useApiCache<T>(
  apiCall: () => Promise<{ data: { DT: T } }>,
  cacheKey: string,
  cacheDuration = 5 * 60 * 1000, // 5 minutes default
): UseApiResponse<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    const cached = localStorage.getItem(`cache_${cacheKey}`);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > cacheDuration;

      if (!isExpired) {
        setState({ data, loading: false, error: null });
        return;
      }
    }

    setState({ data: null, loading: true, error: null });
    try {
      const response = await apiCall();
      const data = response.data.DT;
      localStorage.setItem(
        `cache_${cacheKey}`,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        }),
      );
      setState({ data, loading: false, error: null });
    } catch (err) {
      const error = err as AxiosError;
      setState({
        data: null,
        loading: false,
        error: error?.message || "Failed to fetch data",
      });
    }
  }, [apiCall, cacheKey, cacheDuration]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}
