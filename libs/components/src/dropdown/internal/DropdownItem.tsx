import type { Styled } from '../../hooks/useStyled';
import type { CLASSES } from '../vars';

import { checkNodeExist } from '@laser-ui/utils';

import { mergeCS } from '../../utils';

interface DropdownItemProps {
  children: React.ReactNode;
  namespace: string;
  styled: Styled<typeof CLASSES>;
  id: string;
  level: number;
  icon: React.ReactNode;
  focus: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function DropdownItem(props: DropdownItemProps): React.ReactElement | null {
  const { children, namespace, styled, id, level, icon, focus, disabled, onClick } = props;

  return (
    <li
      {...mergeCS(
        styled('dropdown__item', 'dropdown__item--item', {
          'dropdown__item.is-disabled': disabled,
        }),
        { style: { paddingLeft: 12 + level * 16 } },
      )}
      id={id}
      role="menuitem"
      aria-disabled={disabled}
      onClick={onClick}
    >
      {focus && <div className={`${namespace}-focus-outline`} />}
      {checkNodeExist(icon) && <div {...styled('dropdown__item-icon')}>{icon}</div>}
      <div {...styled('dropdown__item-content')}>{children}</div>
    </li>
  );
}
