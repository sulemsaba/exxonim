import { QueryFunction, QueryKey, useQuery } from 'react-query';

interface ResilientQueryOptions {
  retry?: number;
  retryDelay?: (attempt: number) => number;
  onError?: (error: unknown) => void;
}

export const resilientQuery = <T>(
  key: QueryKey,
  queryFn: QueryFunction<T>,
  options: ResilientQueryOptions = {}
) => {
  const { retry = 1, retryDelay = (attempt) => Math.min(1000 * 2 ** attempt, 3000), onError } = options;

  return useQuery(key, queryFn, {
    retry,
    retryDelay,
    onError: (error) => {
      console.error('Resilient query error:', error);
      if (onError) onError(error);
    },
  });
};