import type { Size } from '../types';

import { useContext } from 'react';

import { LContext } from '../context';

export function useScopedProps(props: { size?: Size; disabled?: boolean }): { size: Size; disabled: boolean } {
  const context = useContext(LContext);

  return { size: props.size ?? context.componentSize ?? 'medium', disabled: props.disabled || context.componentDisabled };
}
