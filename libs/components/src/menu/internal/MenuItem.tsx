import type { Styled } from '../../hooks/useStyled';
import type { MenuMode } from '../types';
import type { CLASSES } from '../vars';

import { checkNodeExist } from '@laser-ui/utils';

import { Tooltip } from '../../tooltip';
import { mergeCS } from '../../utils';

interface MenuItemProps {
  children: React.ReactNode;
  namespace: string;
  styled: Styled<typeof CLASSES>;
  id: string;
  level: number;
  space: number;
  step: number;
  icon: React.ReactNode;
  posinset: [number, number];
  mode: MenuMode;
  inNav: boolean;
  active: boolean;
  focus: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function MenuItem(props: MenuItemProps): React.ReactElement | null {
  const { children, namespace, styled, id, level, space, step, icon, posinset, mode, inNav, active, focus, disabled, onClick } = props;

  const inHorizontalNav = mode === 'horizontal' && inNav;
  const iconMode = mode === 'icon' && inNav;

  const node = (
    <li
      {...mergeCS(
        styled('menu__item', 'menu__item--item', {
          'menu__item--horizontal': inHorizontalNav,
          'menu__item--icon': iconMode,
          'menu__item.is-active': active,
          'menu__item.is-disabled': disabled,
        }),
        { style: { paddingLeft: space + level * step } },
      )}
      id={id}
      role="menuitem"
      aria-disabled={disabled}
      onClick={onClick}
    >
      {focus && <div className={`${namespace}-focus-outline`} />}
      <div
        {...styled('menu__indicator', {
          'menu__indicator--first': posinset[0] === 0 && posinset[1] > 1,
          'menu__indicator--last': posinset[0] === posinset[1] - 1 && posinset[1] > 1,
        })}
      >
        <div {...styled('menu__indicator-track', { 'menu__indicator-track--hidden': level === 0 })} />
        <div {...styled('menu__indicator-thumb')} />
      </div>
      {checkNodeExist(icon) && <div {...styled('menu__item-icon')}>{icon}</div>}
      <div {...styled('menu__item-content')}>{children}</div>
    </li>
  );

  return (
    <Tooltip title={children} placement="right">
      {(render) => (iconMode ? render(node) : node)}
    </Tooltip>
  );
}
