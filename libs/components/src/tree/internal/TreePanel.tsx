import type { Styled } from '../../hooks/useStyled';
import type { VirtualScrollOptimization } from '../../virtual-scroll/types';
import type { AbstractTreeNode } from '../node/abstract-node';
import type { TreeItem } from '../types';
import type { CLASSES } from '../vars';

import { useEventCallback } from '@laser-ui/hooks';
import { scrollIntoViewIfNeeded } from '@laser-ui/utils';
import AddBoxOutlined from '@material-design-icons/svg/outlined/add_box.svg?react';
import ArrowRightOutlined from '@material-design-icons/svg/outlined/arrow_right.svg?react';
import IndeterminateCheckBoxOutlined from '@material-design-icons/svg/outlined/indeterminate_check_box.svg?react';
import { isUndefined } from 'lodash';
import { cloneElement, forwardRef, useImperativeHandle, useMemo, useRef } from 'react';

import { Checkbox } from '../../checkbox';
import { Empty } from '../../empty';
import { useTranslation } from '../../hooks';
import { Icon } from '../../icon';
import { CircularProgress } from '../../internal/circular-progress';
import { CollapseTransition } from '../../internal/transition';
import { mergeCS } from '../../utils';
import { TTANSITION_DURING_BASE } from '../../vars';
import { VirtualScroll, type VirtualScrollRef } from '../../virtual-scroll';

interface TreePanelProps<V extends React.Key, T extends TreeItem<V>> extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  namespace: string;
  styled: Styled<typeof CLASSES>;
  list: AbstractTreeNode<V, T>[];
  itemId: (value: V) => string;
  itemSelected: AbstractTreeNode<V, T> | undefined;
  itemFocused: AbstractTreeNode<V, T> | undefined;
  expands: Set<V>;
  customItem: ((item: T) => React.ReactNode) | undefined;
  showLine: boolean;
  multiple: boolean;
  onlyLeafSelectable: boolean;
  disabled: boolean;
  virtual: { listSize: number; listPadding: number; itemSize?: number } | undefined;
  focusVisible: boolean;
  onNodeFocus: (node: AbstractTreeNode<V, T>) => void;
  onNodeExpand: (node: AbstractTreeNode<V, T>) => void;
  onNodeClick: (node: AbstractTreeNode<V, T>) => void;
  onScrollBottom: (() => void) | undefined;
}

function TreePanelFC<V extends React.Key, T extends TreeItem<V>>(
  props: TreePanelProps<V, T>,
  ref: React.ForwardedRef<any>,
): React.ReactElement | null {
  const {
    namespace,
    styled,
    list,
    itemId,
    itemSelected,
    itemFocused,
    expands,
    customItem,
    showLine,
    multiple,
    onlyLeafSelectable,
    disabled,
    virtual,
    focusVisible,
    onNodeFocus,
    onNodeExpand,
    onNodeClick,
    onScrollBottom,

    ...restProps
  } = props;

  const { t } = useTranslation();

  const listRef = useRef<HTMLUListElement>(null);
  const vsRef = useRef<VirtualScrollRef<AbstractTreeNode<V, T>>>(null);

  const handleKeyDown = useEventCallback((code: any) => {
    if (listRef.current) {
      let item: AbstractTreeNode<V, T> | undefined;
      if (itemFocused) {
        const isExpand = expands.has(itemFocused.id);

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
            if (!itemFocused.isLeaf && isExpand) {
              onNodeExpand(itemFocused);
            } else if (itemFocused.parent) {
              item = vsRef.current?.scrollToItem(listRef.current, itemFocused.parent.id);
            }
            break;

          case 'next-level':
            if (!itemFocused.isLeaf) {
              if (isExpand) {
                item = vsRef.current?.scrollToNested(listRef.current);
              } else {
                onNodeExpand(itemFocused);
              }
            }
            break;

          default:
            if (code instanceof HTMLElement && listRef.current) {
              scrollIntoViewIfNeeded(code, listRef.current);
            }
            break;
        }
      }
      return item;
    }
  });

  useImperativeHandle(ref, () => handleKeyDown, [handleKeyDown]);

  const vsProps = useMemo<VirtualScrollOptimization<AbstractTreeNode<V, T>>>(
    () => ({
      list,
      itemKey: (item) => item.id,
      itemSize: virtual?.itemSize ?? 32,
      itemEmptySize: 32,
      itemNested: (item) => item.children,
      itemFocusable: (item) => item.enabled,
      itemExpand: (item) => (item.children ? expands.has(item.id) : undefined),
    }),
    [expands, list, virtual],
  );

  return (
    <VirtualScroll
      {...vsProps}
      ref={vsRef}
      enable={!isUndefined(virtual)}
      listSize={virtual?.listSize ?? 0}
      listPadding={virtual?.listPadding ?? 0}
      itemRender={(item, index, props, ancestry, children) => {
        if (item.children) {
          const isExpand = expands.has(item.id);

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
              {...styled('tree__group', {
                'tree__group--root': props['aria-level'] === 1,
              })}
              {...props}
              key={item.id}
              role="treeitem"
              aria-expanded={isExpand}
              aria-selected={item.checked}
              aria-disabled={item.disabled}
            >
              <div
                {...styled('tree__option', {
                  'tree__option.is-selected': !multiple && item.checked,
                  'tree__option.is-disabled': item.disabled,
                  'tree__option--root': props['aria-level'] === 1,
                  'tree__option--first': index === 0,
                })}
                id={itemId(item.id)}
                title={item.origin.label}
                onClick={() => {
                  onNodeFocus(item);
                  if (multiple || onlyLeafSelectable) {
                    onNodeExpand(item);
                  } else {
                    onNodeClick(item);
                  }
                }}
              >
                {focusVisible && itemFocused?.id === item.id && <div className={`${namespace}-focus-outline`} />}
                {isSelectedAncestry && <div {...styled('tree__option-dot')} />}
                <div
                  {...styled('tree__option-icon')}
                  onClick={(e) => {
                    e.stopPropagation();

                    onNodeFocus(item);
                    onNodeExpand(item);
                  }}
                >
                  <Icon>
                    {item.origin.loading ? (
                      <CircularProgress />
                    ) : showLine ? (
                      isExpand ? (
                        <IndeterminateCheckBoxOutlined />
                      ) : (
                        <AddBoxOutlined />
                      )
                    ) : (
                      <ArrowRightOutlined
                        {...styled('tree__option-arrow', {
                          'tree__option-arrow.is-expand': isExpand,
                        })}
                      />
                    )}
                  </Icon>
                </div>
                {multiple && (
                  <div {...styled('tree__option-checkbox')}>
                    <Checkbox
                      model={item.checked}
                      disabled={item.disabled}
                      indeterminate={item.indeterminate}
                      inputRender={(el) => cloneElement(el, { tabIndex: -1 })}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNodeFocus(item);
                        onNodeClick(item);
                      }}
                    />
                  </div>
                )}
                <div {...styled('tree__option-content')}>{customItem ? customItem(item.origin) : item.origin.label}</div>
              </div>
              {!item.origin.loading && (
                <CollapseTransition
                  originalSize={{
                    height: 'auto',
                  }}
                  collapsedSize={{
                    height: 0,
                  }}
                  enter={isExpand}
                  during={TTANSITION_DURING_BASE}
                  styles={{
                    entering: {
                      transition: ['height', 'padding', 'margin'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-out`).join(', '),
                    },
                    leaving: {
                      transition: ['height', 'padding', 'margin'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-in`).join(', '),
                    },
                    leaved: { display: 'none' },
                  }}
                >
                  {(listRef, collapseStyle) => (
                    <ul
                      {...mergeCS(styled('tree__group'), {
                        style: collapseStyle,
                      })}
                      ref={listRef}
                      role="group"
                      aria-labelledby={itemId(item.id)}
                    >
                      {children}
                    </ul>
                  )}
                </CollapseTransition>
              )}
            </li>
          );
        }

        return (
          <li
            {...styled('tree__option', {
              'tree__option.is-selected': !multiple && item.checked,
              'tree__option.is-disabled': item.disabled,
              'tree__option--root': props['aria-level'] === 1,
              'tree__option--first': index === 0,
            })}
            {...props}
            key={item.id}
            id={itemId(item.id)}
            title={item.origin.label}
            role="treeitem"
            aria-selected={item.checked}
            aria-disabled={item.disabled}
            onClick={() => {
              onNodeFocus(item);
              onNodeClick(item);
            }}
          >
            {focusVisible && itemFocused?.id === item.id && <div className={`${namespace}-focus-outline`} />}
            {multiple && (
              <div {...styled('tree__option-checkbox')}>
                <Checkbox
                  model={item.checked}
                  disabled={item.disabled}
                  indeterminate={item.indeterminate}
                  inputRender={(el) => cloneElement(el, { tabIndex: -1 })}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNodeFocus(item);
                    onNodeClick(item);
                  }}
                />
              </div>
            )}
            <div {...styled('tree__option-content')}>{customItem ? customItem(item.origin) : item.origin.label}</div>
          </li>
        );
      }}
      itemFocused={itemFocused?.id}
      itemEmptyRender={() => (
        <li {...styled('tree__empty')}>
          <div {...styled('tree__option-content')}>{t('No data')}</div>
        </li>
      )}
      itemInAriaSetsize={(item) => !item.children}
      placeholder="li"
      onScrollEnd={onScrollBottom}
    >
      {(vsList, onScroll) => (
        <ul
          {...restProps}
          {...mergeCS(
            styled('tree', {
              'tree.is-disabled': disabled,
              'tree--line': showLine,
            }),
            {
              className: restProps.className,
              style: restProps.style,
            },
          )}
          ref={listRef}
          role="tree"
          aria-multiselectable={multiple}
          aria-activedescendant={isUndefined(itemFocused) ? undefined : itemId(itemFocused.id)}
          onScroll={onScroll}
        >
          {list.length === 0 ? <Empty style={{ padding: '12px 28px' }} image={Empty.SIMPLE_IMG} /> : vsList}
        </ul>
      )}
    </VirtualScroll>
  );
}

export const TreePanel: <V extends React.Key, T extends TreeItem<V>>(
  props: TreePanelProps<V, T> & React.RefAttributes<any>,
) => ReturnType<typeof TreePanelFC> = forwardRef(TreePanelFC) as any;
