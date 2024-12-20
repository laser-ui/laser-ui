import type { TableFilterProps } from './types';

import SearchOutlined from '@material-design-icons/svg/outlined/search.svg?react';
import { isUndefined } from 'lodash';

import { CLASSES } from './vars';
import { Button } from '../button';
import { useComponentProps, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { Input } from '../input';
import { Popover } from '../popover';

export function TableFilter(props: TableFilterProps): React.ReactElement | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    content,
    footer,
    visible,
    placement = 'bottom-right',
    placementFixed = false,
    escClosable = true,
    gap,
    inWindow = false,
    searchable = false,
    searchValue,
    modal = false,
    destroyAfterClose = false,
    zIndex,
    onVisibleChange,
    onSearch,
    onReset,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('TableFilter', props);

  const styled = useStyled(CLASSES, { table: styleProvider?.table }, styleOverrides);

  const { t } = useTranslation();

  return (
    <Popover
      {...restProps}
      children={children}
      content={
        <div {...styled('table__filter')}>
          {searchable && (
            <Input
              style={{ display: 'flex' }}
              model={searchValue}
              prefix={
                <Icon>
                  <SearchOutlined />
                </Icon>
              }
              placeholder={t('Search')}
              clearable
              onModelChange={(value) => {
                onSearch?.(value);
              }}
            />
          )}
          {content}
        </div>
      }
      footer={
        isUndefined(footer) ? (
          <Popover.Footer
            styleOverrides={{ popover__footer: { style: { justifyContent: 'space-between' } } }}
            actions={[
              <Button
                pattern="link"
                onClick={() => {
                  onReset?.();
                }}
              >
                {t('Table', 'Reset')}
              </Button>,
              'ok',
            ]}
          />
        ) : footer === false ? undefined : (
          footer
        )
      }
      visible={visible}
      trigger="click"
      placement={placement}
      placementFixed={placementFixed}
      arrow={false}
      escClosable={escClosable}
      gap={gap}
      inWindow={inWindow}
      modal={modal}
      destroyAfterClose={destroyAfterClose}
      zIndex={zIndex}
      onVisibleChange={onVisibleChange}
      afterVisibleChange={afterVisibleChange}
    />
  );
}
