import type { Styled } from '../../hooks/useStyled';
import type { VirtualScrollOptimization, VirtualScrollRef } from '../../virtual-scroll/types';
import type { DropdownItem } from '../types';
import type { CLASSES } from '../vars';

import { checkNodeExist } from '@laser-ui/utils';
import { isNumber, isUndefined, nth } from 'lodash';
import { Fragment, useCallback, useMemo, useRef } from 'react';

import { DropdownSub } from './DropdownSub';
import { useTranslation } from '../../hooks';
import { Separator } from '../../separator';
import { mergeCS } from '../../utils';
import { VirtualScroll } from '../../virtual-scroll';
import { getSameLevelEnableItems } from '../utils';

interface DropdownListProps<ID extends React.Key, T extends DropdownItem<ID>> {
  namespace: string;
  styled: Styled<typeof CLASSES>;
  ulProps: any;
  list: T[];
  ancestryOfSub?: T[];
  virtual?: boolean | number;
  focusVisible: boolean;
  focusId: ID | undefined;
  popupIds: { id: ID; visible: boolean }[];
  updateSubPosition: React.RefObject<Map<ID, () => void>>;
  trigger: 'hover' | 'click';
  zIndex: string | number;
  handleKeyDown: React.RefObject<React.KeyboardEventHandler<HTMLElement> | undefined>;
  getItemId: (id: ID) => string;
  onClick?: (id: ID, origin: T) => void | false;
  onFocusIdsChange: (ids: ID[]) => void;
  onPopupIdsChange: (ids: { id: ID; visible: boolean }[]) => void;
  addPopupId: (id: ID) => void;
  removePopupId: (id: ID) => void;
  onVisibleChange: (visible: boolean) => void;
}

export function DropdownList<ID extends React.Key, T extends DropdownItem<ID>>(props: DropdownListProps<ID, T>): React.ReactElement | null {
  const {
    namespace,
    styled,
    ulProps,
    list,
    ancestryOfSub = [],
    virtual,
    focusVisible,
    focusId,
    popupIds,
    updateSubPosition,
    trigger,
    zIndex,
    handleKeyDown,
    getItemId,
    onClick,
    onFocusIdsChange,
    onPopupIdsChange,
    addPopupId,
    removePopupId,
    onVisibleChange,
  } = props;

  const ulRef = useRef<HTMLUListElement>(null);
  const vsRef = useRef<VirtualScrollRef<T>>(null);

  const { t } = useTranslation();

  const canSelectedItem = useCallback((item: T) => !item.disabled && item.type !== 'group', []);

  const ancestryOfSubIds = ancestryOfSub.map((item) => item.id);

  const vsProps = useMemo<VirtualScrollOptimization<T>>(
    () => ({
      list,
      itemKey: (item) => item.id,
      itemSize: (item) => (item.separator ? 3 : 0) + (isNumber(virtual) ? virtual : 32),
      itemEmptySize: 32,
      itemNested: (item) => (item.type === 'group' ? (item.children as T[]) : undefined),
      itemFocusable: canSelectedItem,
    }),
    [canSelectedItem, list, virtual],
  );

  return (
    <VirtualScroll
      {...vsProps}
      ref={(instance) => {
        vsRef.current = instance;
        return () => {
          vsRef.current = null;
        };
      }}
      enable={virtual !== false}
      listSize={200 + 32 * 2}
      listPadding={4}
      itemRender={(item, index, props, ancestry, childrenNode) => {
        const {
          id: itemId,
          title: itemTitle,
          type: itemType,
          icon: itemIcon,
          disabled: itemDisabled = false,
          separator: itemSeparator,
          children,
        } = item;

        const id = getItemId(itemId);
        const isFocus = itemId === focusId;
        const popupState = popupIds.find((v) => v.id === itemId);
        const currentAncestryOfSub = ancestryOfSub.concat(itemType === 'sub' ? [item] : []);

        const handleItemClick = () => {
          const close = onClick?.(itemId, item);

          onFocusIdsChange(ancestryOfSubIds.concat([itemId]));
          if (close !== false) {
            onVisibleChange(false);
          }
        };

        if (isFocus) {
          handleKeyDown.current = (e) => {
            const sameLevelItems = getSameLevelEnableItems((nth(ancestryOfSub, -1)?.children as T[]) ?? list);
            const focusItem = (val?: T) => {
              if (val) {
                onFocusIdsChange(ancestryOfSub.map((item) => item.id).concat([val.id]));
              }
            };
            const scrollToItem = (val?: T) => {
              if (ulRef.current && val) {
                vsRef.current?.scrollToItem(ulRef.current, val.id);
              }
            };

            switch (e.code) {
              case 'ArrowUp': {
                e.preventDefault();
                const index = sameLevelItems.findIndex((sameLevelItem) => sameLevelItem.id === itemId);
                const item = nth(sameLevelItems, index - 1);
                focusItem(item);
                scrollToItem(item);
                if (item && nth(popupIds, -1)?.id === itemId) {
                  onPopupIdsChange(popupIds.slice(0, -1));
                }
                break;
              }

              case 'ArrowDown': {
                e.preventDefault();
                const index = sameLevelItems.findIndex((sameLevelItem) => sameLevelItem.id === itemId);
                const item = nth(sameLevelItems, (index + 1) % sameLevelItems.length);
                focusItem(item);
                scrollToItem(item);
                if (item && nth(popupIds, -1)?.id === itemId) {
                  onPopupIdsChange(popupIds.slice(0, -1));
                }
                break;
              }

              case 'ArrowLeft': {
                e.preventDefault();
                onPopupIdsChange(popupIds.slice(0, -1));
                if (ancestryOfSubIds.length > 0) {
                  onFocusIdsChange(ancestryOfSubIds);
                }
                break;
              }

              case 'ArrowRight':
                e.preventDefault();
                if (itemType === 'sub') {
                  addPopupId(itemId);
                  if (children) {
                    const newFocusItem = nth(getSameLevelEnableItems(children), 0);
                    if (newFocusItem) {
                      onFocusIdsChange(currentAncestryOfSub.map((item) => item.id).concat([newFocusItem.id]));
                    }
                  }
                }
                break;

              case 'Home':
                e.preventDefault();
                focusItem(nth(sameLevelItems, 0));
                if (ulRef.current) {
                  ulRef.current.scrollTop = 0;
                }
                break;

              case 'End':
                e.preventDefault();
                focusItem(nth(sameLevelItems, -1));
                if (ulRef.current) {
                  ulRef.current.scrollTop = ulRef.current.scrollHeight;
                }
                break;

              case 'Enter':
              case 'Space':
                e.preventDefault();
                if (itemType === 'item') {
                  handleItemClick();
                } else if (itemType === 'sub') {
                  addPopupId(itemId);
                }
                break;

              default:
                break;
            }
          };
        }

        return (
          <Fragment key={itemId}>
            {itemSeparator && <Separator style={{ margin: '2px 0' }} />}
            {itemType === 'item' ? (
              <li
                {...styled('dropdown__item', 'dropdown__item--item', {
                  'dropdown__item.is-disabled': itemDisabled,
                })}
                id={id}
                role="menuitem"
                aria-disabled={itemDisabled}
                onClick={handleItemClick}
              >
                {focusVisible && isFocus && <div className={`${namespace}-focus-outline`} />}
                {checkNodeExist(itemIcon) && <div {...styled('dropdown__item-icon')}>{itemIcon}</div>}
                <div {...styled('dropdown__item-content')}>{itemTitle}</div>
              </li>
            ) : itemType === 'group' ? (
              <>
                <li {...styled('dropdown__group-title')} id={id} role="presentation">
                  {itemTitle}
                </li>
                <ul
                  {...mergeCS(styled('dropdown__group-list'), {
                    style: {
                      '--level': (() => {
                        let val = 1;
                        for (let index = ancestry.length - 1; index > -1; index--) {
                          if (ancestry[index].type === 'group') {
                            val += 1;
                          }
                          if (ancestry[index].type === 'sub') {
                            break;
                          }
                        }
                        return val;
                      })(),
                    } as any,
                  })}
                  role="group"
                  aria-labelledby={id}
                >
                  {childrenNode}
                </ul>
              </>
            ) : (
              <DropdownSub
                ref={(instance) => {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  const fn = instance!;
                  updateSubPosition.current.set(itemId, fn);
                  return () => {
                    updateSubPosition.current.delete(itemId);
                  };
                }}
                namespace={namespace}
                styled={styled}
                id={id}
                icon={itemIcon}
                list={
                  <DropdownList
                    namespace={namespace}
                    styled={styled}
                    ulProps={{ 'aria-labelledby': id }}
                    list={(children ?? []) as T[]}
                    ancestryOfSub={currentAncestryOfSub}
                    virtual={virtual}
                    focusVisible={focusVisible}
                    focusId={focusId}
                    popupIds={popupIds}
                    updateSubPosition={updateSubPosition}
                    trigger={trigger}
                    zIndex={zIndex}
                    handleKeyDown={handleKeyDown}
                    getItemId={getItemId}
                    onClick={onClick}
                    onFocusIdsChange={onFocusIdsChange}
                    onPopupIdsChange={onPopupIdsChange}
                    addPopupId={addPopupId}
                    removePopupId={removePopupId}
                    onVisibleChange={onVisibleChange}
                  />
                }
                popupState={popupState?.visible}
                trigger={trigger}
                focus={focusVisible && isFocus}
                disabled={itemDisabled}
                zIndex={
                  isUndefined(zIndex)
                    ? zIndex
                    : isNumber(zIndex)
                      ? zIndex + 1 + ancestryOfSub.length
                      : `calc(${zIndex} + ${1 + ancestryOfSub.length})`
                }
                onVisibleChange={(visible) => {
                  if (visible) {
                    if (ancestryOfSub.length === 0) {
                      onPopupIdsChange([{ id: itemId, visible: true }]);
                    } else {
                      addPopupId(itemId);
                    }
                  } else {
                    removePopupId(itemId);
                  }
                }}
              >
                {itemTitle}
              </DropdownSub>
            )}
          </Fragment>
        );
      }}
      itemFocused={focusId}
      itemEmptyRender={() => (
        <li {...styled('dropdown__empty')}>
          <div {...styled('dropdown__item-content')}>{t('No data')}</div>
        </li>
      )}
      itemInAriaSetsize={(item) => item.type === 'item'}
      placeholder="li"
    >
      {(vsList, onScroll) => (
        <ul
          {...styled('dropdown__list')}
          {...ulProps}
          ref={(instance) => {
            ulRef.current = instance;
            return () => {
              ulRef.current = null;
            };
          }}
          tabIndex={-1}
          role="menu"
          onScroll={onScroll}
        >
          {list.length === 0 ? (
            <li {...styled('dropdown__empty')}>
              <div {...styled('dropdown__item-content')}>{t('No data')}</div>
            </li>
          ) : (
            vsList
          )}
        </ul>
      )}
    </VirtualScroll>
  );
}
