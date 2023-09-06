import type { Styled } from '../../hooks/useStyled';
import type { CLASSES } from '../vars';

import { useEffect, useRef, useState } from 'react';

interface BadgeNumberProps {
  styled: Styled<typeof CLASSES>;
  value: number;
  valueDown: boolean;
}

export function BadgeNumber(props: BadgeNumberProps): JSX.Element | null {
  const { styled, value, valueDown } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const dataRef = useRef<{
    prevValue: number;
  }>({
    prevValue: value,
  });

  const [nums, setNums] = useState<number[]>([value]);

  useEffect(() => {
    if (containerRef.current && dataRef.current.prevValue !== value) {
      let newNums: number[] = Array.from({ length: 10 }).map((_, i) => i);
      if (valueDown) {
        newNums = newNums.concat(Array.from({ length: dataRef.current.prevValue + 1 }).map((_, i) => i));
        newNums = newNums.slice(newNums.length - 10, newNums.length);
        containerRef.current.style.cssText = 'transform:translateY(-900%);transition:none;';
      } else {
        newNums = Array.from({ length: 10 - dataRef.current.prevValue })
          .map((_, i) => dataRef.current.prevValue + i)
          .concat(newNums);
        newNums = newNums.slice(0, 10);
        containerRef.current.style.cssText = 'transform:translateY(0);transition:none;';
      }
      dataRef.current.prevValue = value;
      setNums(newNums);
    }
  }, [value, valueDown]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.cssText = `transform:translateY(-${nums.findIndex((n) => n === value) * 100}%); `;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nums]);

  return (
    <div {...styled('badge__number-container')} ref={containerRef}>
      {nums.map((n, i) => (
        <span {...styled('badge__number')} key={i}>
          {n}
        </span>
      ))}
    </div>
  );
}
