import type { Styled } from '../../hooks/useStyled';
import type { AbstractTreeNode } from '../../tree/node/abstract-node';
import type { VirtualScrollOptimization } from '../../virtual-scroll/types';
import type { CascaderItem } from '../types';
import type { CLASSES } from '../vars';

import { useEventCallback } from '@laser-ui/hooks';
import { scrollIntoViewIfNeeded } from '@laser-ui/utils';
import KeyboardArrowRightOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_right.svg?react';
import { isNumber, isUndefined } from 'lodash';
import { useImperativeHandle, useMemo, useRef } from 'react';

import { Checkbox } from '../../checkbox';
import { Empty } from '../../empty';
import { Icon } from '../../icon';
import { CircularProgress } from '../../internal/circular-progress';
import { VirtualScroll, type VirtualScrollRef } from '../../virtual-scroll';

interface CascaderPanelProps<V extends React.Key, T extends CascaderItem<V>> {
  ref?: React.Ref<(code: any) => AbstractTreeNode<V, T> | undefined>;
  namespace: string;
  styled: Styled<typeof CLASSES>;
  id: string | undefined;
  list: AbstractTreeNode<V, T>[];
  customItem: ((item: T) => React.ReactNode) | undefined;
  itemId: (value: V) => string;
  itemSelected: AbstractTreeNode<V, T> | undefined;
  itemFocused: AbstractTreeNode<V, T> | undefined;
  multiple: boolean;
  virtual: boolean | number;
  focusVisible: boolean;
  onFocus: (item: AbstractTreeNode<V, T>) => void;
  onClick: (item: AbstractTreeNode<V, T>) => void;
}

export function CascaderPanel<V extends React.Key, T extends CascaderItem<V>>(props: CascaderPanelProps<V, T>): React.ReactElement | null {
  const {
    ref,
    namespace,
    styled,
    id,
    list,
    customItem,
    itemId,
    itemSelected,
    itemFocused,
    multiple,
    virtual,
    focusVisible,
    onFocus,
    onClick,

    _root = true,
  } = props as CascaderPanelProps<V, T> & { _root?: boolean };

  const listRef = useRef<HTMLUListElement>(null);
  const vsRef = useRef<VirtualScrollRef<AbstractTreeNode<V, T>>>(null);
  const focusRef = useRef<any>(null);

  const isFocused = itemFocused && list.findIndex((node) => node.id === itemFocused.id) !== -1;
  const nodeFocused = (() => {
    if (itemFocused) {
      for (const node of list) {
        if (itemFocused.id === node.id) {
          return node;
        }
        let n = itemFocused;
        while (n.parent) {
          n = n.parent;
          if (n.id === node.id) {
            return node;
          }
        }
      }
    }
  })();

  const handleKeyDown = useEventCallback((code: any) => {
    if (listRef.current) {
      let item: AbstractTreeNode<V, T> | undefined;
      if (_root && isUndefined(itemFocused)) {
        switch (code) {
          case 'first':
          case 'next':
            item = vsRef.current?.scrollToStart(listRef.current);
            break;

          case 'last':
          case 'prev':
            item = vsRef.current?.scrollToEnd(listRef.current);

            break;

          default:
            break;
        }
      } else if (isFocused) {
        switch (code) {
          case 'next':
            item = vsRef.current?.scrollToStep(listRef.current, 1);
            break;

          case 'prev':
            item = vsRef.current?.scrollToStep(listRef.current, -1);
            break;

          case 'first':
            item = vsRef.current?.scrollToStart(listRef.current);
            break;

          case 'last':
            item = vsRef.current?.scrollToEnd(listRef.current);
            break;

          case 'prev-level':
            if (nodeFocused && nodeFocused.parent) {
              item = nodeFocused.parent;
            }
            break;

          case 'next-level':
            if (nodeFocused && nodeFocused.children) {
              for (const node of nodeFocused.children) {
                if (node.enabled) {
                  item = node;
                  break;
                }
              }
            }
            break;

          default:
            if (code instanceof HTMLElement && listRef.current) {
              scrollIntoViewIfNeeded(code, listRef.current);
            }
            break;
        }
      } else {
        item = focusRef.current?.(code);
      }
      return item;
    }
  });

  useImperativeHandle(ref, () => handleKeyDown, [handleKeyDown]);

  const vsProps = useMemo<VirtualScrollOptimization<AbstractTreeNode<V, T>>>(
    () => ({
      list,
      itemKey: (item) => item.id,
      itemSize: isNumber(virtual) ? virtual : 32,
      itemFocusable: (item) => item.enabled,
    }),
    [list, virtual],
  );

  return (
    <>
      <VirtualScroll
        {...vsProps}
        ref={vsRef}
        enable={virtual !== false}
        listSize={264}
        listPadding={4}
        itemRender={(item, index, props) => {
          let isSelectedAncestry = false;
          if (item.children && itemSelected) {
            let node = itemSelected;
            while (node.parent) {
              node = node.parent;
              if (node.id === item.id) {
                isSelectedAncestry = true;
                break;
              }
            }
          }

          return (
            <li
              {...styled('cascader__option', {
                'cascader__option.is-focused': item.id === nodeFocused?.id,
                'cascader__option.is-selected': !multiple && item.checked,
                'cascader__option.is-disabled': item.disabled,
              })}
              {...props}
              key={item.id}
              id={itemId(item.id)}
              title={item.origin.label}
              role="option"
              aria-selected={item.checked}
              aria-disabled={item.disabled}
              onClick={() => {
                onFocus(item);
                if (!(multiple && !item.isLeaf)) {
                  onClick(item);
                }
              }}
            >
              {focusVisible && itemFocused?.id === item.id && <div className={`${namespace}-focus-outline`} />}
              {isSelectedAncestry && <div {...styled('cascader__option-dot')} />}
              {multiple && (
                <div {...styled('cascader__option-prefix')}>
                  <Checkbox
                    model={item.checked}
                    disabled={item.disabled}
                    indeterminate={item.indeterminate}
                    onClick={(e) => {
                      e.stopPropagation();
                      onFocus(item);
                      onClick(item);
                    }}
                  />
                </div>
              )}
              <div {...styled('cascader__option-content')}>{customItem ? customItem(item.origin) : item.origin.label}</div>
              {!item.isLeaf && (
                <div {...styled('cascader__option-icon')}>
                  <Icon>{item.origin.loading ? <CircularProgress /> : <KeyboardArrowRightOutlined />}</Icon>
                </div>
              )}
            </li>
          );
        }}
        itemFocused={nodeFocused?.id}
        placeholder="li"
      >
        {(vsList, onScroll) => (
          <ul
            {...styled('cascader__list', 'cascader__list--inline')}
            ref={listRef}
            id={id}
            tabIndex={-1}
            role="listbox"
            aria-multiselectable={multiple}
            aria-activedescendant={_root && !isUndefined(itemFocused) ? itemId(itemFocused.id) : undefined}
            onScroll={onScroll}
          >
            {list.length === 0 ? <Empty style={{ padding: '12px 28px' }} image={Empty.SIMPLE_IMG} /> : vsList}
          </ul>
        )}
      </VirtualScroll>
      {nodeFocused && !nodeFocused.origin.loading && nodeFocused.children && (
        <CascaderPanel {...props} {...{ _root: false }} ref={focusRef} id={undefined} list={nodeFocused.children} />
      )}
    </>
  );
}
