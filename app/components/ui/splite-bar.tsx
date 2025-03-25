import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

interface SpliteBarProps {
  value: number;
  max: number;
  onChange?: (value: number) => void;
  onSeek?: (value: number) => void;
  className?: string;
  trackClassName?: string;
  rangeClassName?: string;
}

export function SpliteBar({
  value,
  max,
  onChange,
  onSeek,
  className,
  trackClassName,
  rangeClassName,
}: SpliteBarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const updateValue = useCallback(
    (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
      if (!trackRef.current) return;

      const trackRect = trackRef.current.getBoundingClientRect();
      const clickPosition = event.clientX - trackRect.left;
      const percentageClicked = clickPosition / trackRect.width;
      const newValue = Math.max(0, Math.min(max, percentageClicked * max));

      if (onChange) {
        onChange(newValue);
      }
    },
    [max, onChange]
  );

  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    updateValue(event);
    if (onSeek) {
      const trackRect = trackRef.current!.getBoundingClientRect();
      const clickPosition = event.clientX - trackRect.left;
      const percentageClicked = clickPosition / trackRect.width;
      const newValue = Math.max(0, Math.min(max, percentageClicked * max));
      onSeek(newValue);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        updateValue(event);
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (isDragging && onSeek && trackRef.current) {
        const trackRect = trackRef.current.getBoundingClientRect();
        const clickPosition = event.clientX - trackRect.left;
        const percentageClicked = clickPosition / trackRect.width;
        const newValue = Math.max(0, Math.min(max, percentageClicked * max));
        onSeek(newValue);
      }
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, max, onSeek, updateValue]);

  return (
    <div
      className={cn('relative cursor-pointer', className)}
      ref={trackRef}
      onClick={handleTrackClick}
      onMouseDown={handleMouseDown}
    >
      <div className={cn('splite-track', trackClassName)}>
        <div
          className={cn('splite-range', rangeClassName)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
} 