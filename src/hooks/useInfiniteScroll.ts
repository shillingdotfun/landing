// src/hooks/useInfiniteScroll.ts

import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = (
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      >= document.documentElement.offsetHeight - (options.threshold || 100)
    ) {
      if (!isFetching && hasMore) {
        setIsFetching(true);
        callback();
      }
    }
  }, [isFetching, hasMore, callback, options.threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    isFetching,
    setIsFetching,
    hasMore,
    setHasMore,
  };
};
