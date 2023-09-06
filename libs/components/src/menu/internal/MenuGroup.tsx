import type { Styled } from '../../hooks/useStyled';
import type { CLASSES } from '../vars';

import { useTranslation } from '../../hooks';
import { mergeCS } from '../../utils';

interface MenuGroupProps {
  children: React.ReactNode;
  styled: Styled<typeof CLASSES>;
  id: string;
  level: number;
  space: number;
  step: number;
  list: React.ReactNode;
  empty: boolean;
}

export function MenuGroup(props: MenuGroupProps): JSX.Element | null {
  const { children, styled, id, level, space, step, list, empty } = props;

  const { t } = useTranslation();

  return (
    <ul {...styled('menu__group-list')} role="group" aria-labelledby={id}>
      <li {...mergeCS(styled('menu__group-title'), { style: { paddingLeft: space + level * step } })} id={id} role="presentation">
        {children}
      </li>
      {empty ? <div {...mergeCS(styled('menu__empty'), { style: { paddingLeft: space + (level + 1) * step } })}>{t('No Data')}</div> : list}
    </ul>
  );
}
