import type { AbstractTreeNode } from './node/abstract-node';
import type { TreeItem, TreeProps } from './types';

import { findNested } from '@laser-ui/utils';
import { isNull, isUndefined } from 'lodash';
import { useId, useMemo, useRef, useState } from 'react';

import { TreePanel } from './internal/TreePanel';
import { MultipleTreeNode } from './node/multiple-node';
import { SingleTreeNode } from './node/single-node';
import { CLASSES } from './vars';
import { useComponentProps, useControlled, useFocusVisible, useNamespace, useScopedProps, useStyled } from '../hooks';

export function Tree<V extends React.Key, T extends TreeItem<V>>(props: TreeProps<V, T>): React.ReactElement | null {
  const {
    styleOverrides,
    styleProvider,
    formControl,
    list,
    model,
    defaultModel,
    expands: expandsProp,
    defaultExpands,
    showLine = false,
    multiple = false,
    onlyLeafSelectable = true,
    disabled: disabledProp = false,
    virtual,
    customItem,
    onModelChange,
    onFirstExpand,
    onExpandsChange,
    onScrollBottom,

    ...restProps
  } = useComponentProps('Tree', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { tree: styleProvider?.tree }, styleOverrides);

  const focusRef = useRef<any>(null);

  const expandSaved = useRef(new Set<V>());

  const uniqueId = useId();
  const getItemId = (val: V) => `${namespace}-tree-item-${val}-${uniqueId}`;

  const [nodes, nodesMap] = useMemo(() => {
    const nodes = list.map((item) =>
      multiple
        ? new MultipleTreeNode(item, (origin) => origin.value, {
            disabled: item.disabled,
          })
        : new SingleTreeNode(item, (origin) => origin.value, {
            disabled: item.disabled,
          }),
    );

    const nodesMap = new Map<V, AbstractTreeNode<V, T>>();
    const reduceArr = (arr: AbstractTreeNode<V, T>[]) => {
      for (const item of arr) {
        nodesMap.set(item.id, item);
        if (item.children) {
          reduceArr(item.children);
        }
      }
    };
    reduceArr(nodes);

    return [nodes, nodesMap] as const;
  }, [list, multiple]);

  const [_selected, changeSelected] = useControlled<V | null | V[]>(
    defaultModel ?? (multiple ? [] : null),
    model,
    (value) => {
      if (onModelChange) {
        if (multiple) {
          onModelChange(
            value,
            (value as V[]).map((v) => (nodesMap.get(v) as AbstractTreeNode<V, T>).origin),
          );
        } else {
          onModelChange(value, isNull(value) ? null : (nodesMap.get(value as V) as AbstractTreeNode<V, T>).origin);
        }
      }
    },
    undefined,
    formControl?.control,
  );
  const selected = useMemo(() => (multiple ? new Set(_selected as V[]) : (_selected as V | null)), [_selected, multiple]);
  nodesMap.forEach((node) => {
    node.updateStatus(selected);
  });

  const [_expands, changeExpands] = useControlled<V[]>(defaultExpands ?? [], expandsProp, (value) => {
    if (onExpandsChange) {
      onExpandsChange(
        value,
        value.map((v) => (nodesMap.get(v) as AbstractTreeNode<V, T>).origin),
      );
    }
  });
  const expands = useMemo(() => new Set(_expands), [_expands]);

  const { disabled } = useScopedProps({ disabled: disabledProp || formControl?.control.disabled });

  const hasSelected = multiple ? (selected as Set<V>).size > 0 : !isNull(selected);

  const [focusVisible, focusVisibleWrapper] = useFocusVisible(
    (code) => code.startsWith('Arrow') || ['Home', 'End', 'Enter', 'Space'].includes(code),
  );
  const [_focused, setFocused] = useState<AbstractTreeNode<V, T>>();
  const focused = (() => {
    let node: AbstractTreeNode<V, T> | undefined;

    if (_focused) {
      node = nodesMap.get(_focused.id);
      if (node && node.enabled) {
        return node;
      }
    }

    if (hasSelected) {
      node = findNested(nodes, (node) => node.enabled && node.checked);
    }

    if (isUndefined(node)) {
      node = findNested(nodes, (node) => node.enabled);
    }

    return node;
  })();

  const handleExpand = (node: AbstractTreeNode<V, T>) => {
    const isExpand = expands.has(node.id);

    if (!node.origin.loading) {
      if (isExpand) {
        changeExpands((draft) => {
          draft.splice(
            draft.findIndex((id) => id === node.id),
            1,
          );
        });
      } else {
        if (!expandSaved.current.has(node.id)) {
          expandSaved.current.add(node.id);
          onFirstExpand?.(node.id, node.origin);
        }
        changeExpands((draft) => {
          draft.push(node.id);
        });
      }
    }
  };

  const handleClick = (node: AbstractTreeNode<V, T>) => {
    if (multiple) {
      const checkeds = (node as MultipleTreeNode<V, T>).changeStatus(node.checked ? 'UNCHECKED' : 'CHECKED', selected as Set<V>);
      changeSelected(Array.from(checkeds.keys()));
    } else {
      if (node.isLeaf || !onlyLeafSelectable) {
        changeSelected(node.id);
      }
    }
  };

  return focusVisibleWrapper(
    <TreePanel
      {...restProps}
      ref={focusRef}
      tabIndex={restProps.tabIndex ?? (disabled ? -1 : 0)}
      onKeyDown={(e) => {
        restProps.onKeyDown?.(e);

        const focusItem = (code: 'next' | 'prev' | 'first' | 'last' | 'prev-level' | 'next-level') => {
          if (focusRef.current) {
            const item = focusRef.current(code);

            if (item) {
              setFocused(item);

              if (!virtual && !code.includes('level')) {
                const el = document.getElementById(getItemId(item.id));
                if (el) {
                  focusRef.current(el);
                }
              }
            }
          }
        };

        switch (e.code) {
          case 'ArrowUp':
            e.preventDefault();
            focusItem('prev');
            break;

          case 'ArrowDown':
            e.preventDefault();
            focusItem('next');
            break;

          case 'ArrowLeft':
            e.preventDefault();
            focusItem('prev-level');
            break;

          case 'ArrowRight':
            e.preventDefault();
            focusItem('next-level');
            break;

          case 'Home':
            e.preventDefault();
            focusItem('first');
            break;

          case 'End':
            e.preventDefault();
            focusItem('last');
            break;

          case 'Enter':
          case 'Space':
            e.preventDefault();
            if (focused) {
              handleClick(focused);
            }
            break;

          default:
            break;
        }
      }}
      namespace={namespace}
      styled={styled}
      list={nodes}
      itemId={getItemId}
      itemSelected={!multiple && hasSelected ? nodesMap.get(selected as V) : undefined}
      itemFocused={focused}
      expands={expands}
      customItem={customItem}
      showLine={showLine}
      multiple={multiple}
      onlyLeafSelectable={onlyLeafSelectable}
      disabled={disabled}
      virtual={virtual}
      focusVisible={focusVisible}
      onNodeFocus={setFocused}
      onNodeExpand={handleExpand}
      onNodeClick={handleClick}
      onScrollBottom={onScrollBottom}
    />,
  );
}
