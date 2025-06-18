// src/components/ui/virtual-list.tsx
'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { cn } from '@/lib/utils';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
  keyExtractor?: (item: T, index: number) => string;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  overscan = 5,
  onScroll,
  keyExtractor,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;

  const visibleRange = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    const start = Math.max(0, visibleStart - overscan);
    const end = Math.min(items.length - 1, visibleEnd + overscan);

    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = e.currentTarget.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    },
    [onScroll]
  );

  // Smooth scrolling to specific item
  const scrollToItem = useCallback(
    (index: number) => {
      if (scrollElementRef.current) {
        const targetScrollTop = index * itemHeight;
        scrollElementRef.current.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        });
      }
    },
    [itemHeight]
  );

  return (
    <div
      ref={scrollElementRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${visibleRange.start * itemHeight}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => {
            const actualIndex = visibleRange.start + index;
            const key = keyExtractor
              ? keyExtractor(item, actualIndex)
              : actualIndex;

            return (
              <div key={key} style={{ height: itemHeight }} className="w-full">
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Grid virtualization component
interface VirtualGridProps<T> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  containerWidth: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  gap?: number;
  overscan?: number;
  keyExtractor?: (item: T, index: number) => string;
}

export function VirtualGrid<T>({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  renderItem,
  className,
  gap = 0,
  overscan = 5,
  keyExtractor,
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const itemsPerRow = Math.floor((containerWidth + gap) / (itemWidth + gap));
  const totalRows = Math.ceil(items.length / itemsPerRow);
  const totalHeight = totalRows * (itemHeight + gap) - gap;

  const visibleRange = useMemo(() => {
    const visibleStartRow = Math.floor(scrollTop / (itemHeight + gap));
    const visibleEndRow = Math.min(
      visibleStartRow + Math.ceil(containerHeight / (itemHeight + gap)),
      totalRows - 1
    );

    const start = Math.max(0, visibleStartRow - overscan);
    const end = Math.min(totalRows - 1, visibleEndRow + overscan);

    return { start, end };
  }, [scrollTop, itemHeight, gap, containerHeight, totalRows, overscan]);

  const visibleItems = useMemo(() => {
    const startIndex = visibleRange.start * itemsPerRow;
    const endIndex = Math.min(
      (visibleRange.end + 1) * itemsPerRow,
      items.length
    );
    return items.slice(startIndex, endIndex);
  }, [items, visibleRange, itemsPerRow]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={scrollElementRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${visibleRange.start * (itemHeight + gap)}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {Array.from({
            length: visibleRange.end - visibleRange.start + 1,
          }).map((_, rowIndex) => {
            const actualRowIndex = visibleRange.start + rowIndex;
            const rowStartIndex = actualRowIndex * itemsPerRow;
            const rowEndIndex = Math.min(
              rowStartIndex + itemsPerRow,
              items.length
            );

            return (
              <div
                key={actualRowIndex}
                style={{
                  height: itemHeight,
                  marginBottom: gap,
                  display: 'flex',
                  gap,
                }}
              >
                {items
                  .slice(rowStartIndex, rowEndIndex)
                  .map((item, colIndex) => {
                    const itemIndex = rowStartIndex + colIndex;
                    const key = keyExtractor
                      ? keyExtractor(item, itemIndex)
                      : itemIndex;

                    return (
                      <div
                        key={key}
                        style={{ width: itemWidth, height: itemHeight }}
                      >
                        {renderItem(item, itemIndex)}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Infinite scroll virtual list
interface InfiniteVirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  loadingComponent?: React.ReactNode;
  className?: string;
  threshold?: number;
  keyExtractor?: (item: T, index: number) => string;
}

export function InfiniteVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  loadMore,
  hasMore,
  isLoading,
  loadingComponent,
  className,
  threshold = 5,
  keyExtractor,
}: InfiniteVirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const handleScroll = useCallback(
    async (e: React.UIEvent<HTMLDivElement>) => {
      const element = e.currentTarget;
      const newScrollTop = element.scrollTop;
      setScrollTop(newScrollTop);

      // Check if we need to load more items
      const scrollBottom =
        element.scrollHeight - element.scrollTop - element.clientHeight;
      const shouldLoadMore =
        scrollBottom < threshold * itemHeight &&
        hasMore &&
        !isLoading &&
        !loadingRef.current;

      if (shouldLoadMore) {
        loadingRef.current = true;
        try {
          await loadMore();
        } finally {
          loadingRef.current = false;
        }
      }
    },
    [itemHeight, hasMore, isLoading, loadMore, threshold]
  );

  const totalHeight = items.length * itemHeight + (isLoading ? itemHeight : 0);

  const visibleRange = useMemo(() => {
    const overscan = 5;
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    const start = Math.max(0, visibleStart - overscan);
    const end = Math.min(items.length - 1, visibleEnd + overscan);

    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);

  return (
    <div
      ref={scrollElementRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${visibleRange.start * itemHeight}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => {
            const actualIndex = visibleRange.start + index;
            const key = keyExtractor
              ? keyExtractor(item, actualIndex)
              : actualIndex;

            return (
              <div key={key} style={{ height: itemHeight }} className="w-full">
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
          {isLoading && (
            <div style={{ height: itemHeight }} className="w-full">
              {loadingComponent || (
                <div className="flex h-full items-center justify-center">
                  Loading more items...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
