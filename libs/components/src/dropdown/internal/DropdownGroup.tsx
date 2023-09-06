import type { Styled } from '../../hooks/useStyled';
import type { CLASSES } from '../vars';

import { useTranslation } from '../../hooks';
import { mergeCS } from '../../utils';

interface DropdownGroupProps {
  children: React.ReactNode;
  styled: Styled<typeof CLASSES>;
  id: string;
  level: number;
  list: React.ReactNode;
  empty: boolean;
}

export function DropdownGroup(props: DropdownGroupProps): JSX.Element | null {
  const { children, styled, id, level, list, empty } = props;

  const { t } = useTranslation();

  return (
    <ul {...styled('dropdown__group-list')} role="group" aria-labelledby={id}>
      <li {...mergeCS(styled('dropdown__group-title'), { style: { paddingLeft: 12 + level * 16 } })} id={id} role="presentation">
        {children}
      </li>
      {empty ? <div {...mergeCS(styled('dropdown__empty'), { style: { paddingLeft: 12 + (level + 1) * 16 } })}>{t('No Data')}</div> : list}
    </ul>
  );
}
