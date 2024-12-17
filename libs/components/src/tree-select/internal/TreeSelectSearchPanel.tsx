import type { TreeSelectSearchPanelItem } from './types';
import type { Styled } from '../../hooks/useStyled';
import type { TreeItem } from '../../tree/types';
import type { VirtualScrollOptimization } from '../../virtual-scroll/types';
import type { CLASSES } from '../vars';

import { useEventCallback } from '@laser-ui/hooks';
import { scrollIntoViewIfNeeded } from '@laser-ui/utils';
import { isNumber, isUndefined } from 'lodash';
import { useImperativeHandle, useMemo, useRef } from 'react';

import { Checkbox } from '../../checkbox';
import { Empty } from '../../empty';
import { getTreeNodeLabel } from '../../tree/utils';
import { TREE_NODE_KEY } from '../../tree/vars';
import { VirtualScroll, type VirtualScrollRef } from '../../virtual-scroll';

interface TreeSelectSearchPanelProps<V extends React.Key, T extends TreeItem<V>> {
  ref: React.Ref<(code: any) => TreeSelectSearchPanelItem<V, T> | undefined>;
  namespace: string;
  styled: Styled<typeof CLASSES>;
  id: string;
  list: TreeSelectSearchPanelItem<V, T>[];
  customItem: ((item: T) => React.ReactNode) | undefined;
  itemId: (value: V) => string;
  itemFocused: TreeSelectSearchPanelItem<V, T> | undefined;
  multiple: boolean;
  onlyLeafSelectable: boolean;
  virtual: boolean | number;
  focusVisible: boolean;
  onClick: (item: TreeSelectSearchPanelItem<V, T>) => void;
}

export function TreeSelectSearchPanel<V extends React.Key, T extends TreeItem<V>>(
  props: TreeSelectSearchPanelProps<V, T>,
): React.ReactElement | null {
  const {
    ref,
    namespace,
    styled,
    id,
    list,
    customItem,
    itemId,
    itemFocused,
    multiple,
    onlyLeafSelectable,
    virtual,
    focusVisible,
    onClick,
  } = props;

  const listRef = useRef<HTMLUListElement>(null);
  const vsRef = useRef<VirtualScrollRef<TreeSelectSearchPanelItem<V, T>>>(null);

  const handleKeyDown = useEventCallback((code: any) => {
    if (listRef.current) {
      let item: TreeSelectSearchPanelItem<V, T> | undefined;
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

        default:
          if (code instanceof HTMLElement && listRef.current) {
            scrollIntoViewIfNeeded(code, listRef.current);
          }
          break;
      }
      return item;
    }
  });

  useImperativeHandle(ref, () => handleKeyDown, [handleKeyDown]);

  const vsProps = useMemo<VirtualScrollOptimization<TreeSelectSearchPanelItem<V, T>>>(
    () => ({
      list,
      itemKey: (item) => item.value,
      itemSize: isNumber(virtual) ? virtual : 32,
      itemFocusable: (item) => item[TREE_NODE_KEY].enabled,
    }),
    [list, virtual],
  );

  return (
    <VirtualScroll
      {...vsProps}
      ref={vsRef}
      enable={virtual !== false}
      listSize={264}
      listPadding={4}
      itemRender={(item, index, props) => {
        const node = item[TREE_NODE_KEY];
        let inSelected = node.checked;
        if (!onlyLeafSelectable) {
          let n = node;
          while (n.parent) {
            n = n.parent;
            if (n.id === item.value) {
              inSelected = true;
              break;
            }
          }
        }

        return (
          <li
            {...styled('tree__option', {
              'tree__option.is-selected': !multiple && inSelected,
              'tree__option.is-disabled': node.disabled,
            })}
            {...props}
            key={item.value}
            id={itemId(item.value)}
            title={item.label}
            role="option"
            aria-selected={node.checked}
            aria-disabled={node.disabled}
            onClick={() => {
              onClick(item);
            }}
          >
            {focusVisible && itemFocused?.value === item.value && <div className={`${namespace}-focus-outline`} />}
            {multiple && (
              <div {...styled('tree__option-checkbox')}>
                <Checkbox model={node.checked} disabled={node.disabled} />
              </div>
            )}
            <div {...styled('tree__option-content')}>{customItem ? customItem(node.origin) : getTreeNodeLabel(node)}</div>
          </li>
        );
      }}
      itemFocused={itemFocused?.value}
      placeholder="li"
    >
      {(vsList, onScroll) => (
        <ul
          {...styled('tree')}
          ref={listRef}
          id={id}
          tabIndex={-1}
          role="listbox"
          aria-multiselectable={multiple}
          aria-activedescendant={isUndefined(itemFocused) ? undefined : itemId(itemFocused.value)}
          onScroll={onScroll}
        >
          {list.length === 0 ? <Empty style={{ padding: '12px 28px' }} image={Empty.SIMPLE_IMG} /> : vsList}
        </ul>
      )}
    </VirtualScroll>
  );
}
