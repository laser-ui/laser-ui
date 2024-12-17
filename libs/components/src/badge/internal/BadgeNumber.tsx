import type { Styled } from '../../hooks/useStyled';
import type { CLASSES } from '../vars';

import { useAsync, useIsomorphicLayoutEffect } from '@laser-ui/hooks';
import { useRef, useState } from 'react';

interface BadgeNumberProps {
  styled: Styled<typeof CLASSES>;
  value: number;
  num: number;
}

export function BadgeNumber(props: BadgeNumberProps): React.ReactElement | null {
  const { styled, value, num } = props;

  const async = useAsync();

  const containerRef = useRef<HTMLDivElement>(null);

  const prevValue = useRef(value);
  const prevNum = useRef(num);

  const [nums, setNums] = useState<number[]>([value]);

  useIsomorphicLayoutEffect(() => {
    if (containerRef.current && num !== prevNum.current) {
      let prevNums: number[] = Array.from({ length: 10 }).map((_, i) => i);
      if (num < prevNum.current) {
        prevNums = prevNums.concat(Array.from({ length: prevValue.current + 1 }).map((_, i) => i));
        prevNums = prevNums.slice(prevNums.length - 10, prevNums.length);
        containerRef.current.style.cssText = 'transform:translateY(-900%);transition:none;';
      } else {
        prevNums = Array.from({ length: 10 - prevValue.current })
          .map((_, i) => prevValue.current + i)
          .concat(prevNums);
        prevNums = prevNums.slice(0, 10);
        containerRef.current.style.cssText = 'transform:translateY(0);transition:none;';
      }
      async.setAfterPainted(() => {
        if (containerRef.current) {
          containerRef.current.style.cssText = `transform:translateY(-${prevNums.findIndex((n) => n === value) * 100}%); `;
        }
      });
      setNums(prevNums);
    }
    prevValue.current = value;
    prevNum.current = num;

    return () => {
      async.clearAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [num]);

  return (
    <div
      {...styled('badge__number-container')}
      ref={(instance) => {
        containerRef.current = instance;
        return () => {
          containerRef.current = null;
        };
      }}
    >
      {nums.map((n, i) => (
        <span {...styled('badge__number')} key={i}>
          {n}
        </span>
      ))}
    </div>
  );
}
