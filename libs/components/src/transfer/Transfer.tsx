import type { TransferItem, TransferProps } from './types';

import KeyboardArrowLeftOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_left.svg?react';
import KeyboardArrowRightOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_right.svg?react';
import { isUndefined } from 'lodash';
import { useMemo } from 'react';

import { TransferPanel } from './internal/TransferPanel';
import { CLASSES, IS_SELECTED, NO_MATCH } from './vars';
import { Button } from '../button';
import { useComponentProps, useControlled, useDesign, useNamespace, useScopedProps, useStyled } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

export function Transfer<V extends React.Key, T extends TransferItem<V>>(props: TransferProps<V, T>): React.ReactElement | null {
  const {
    styleOverrides,
    styleProvider,
    formControl,
    list: listProp,
    model,
    defaultModel,
    selected: selectedProp,
    defaultSelected,
    searchable = false,
    searchValue: searchValueProp,
    defaultSearchValue,
    title,
    loading = [false, false],
    disabled: disabledProp = false,
    virtual = false,
    customItem,
    customSearch,
    onModelChange,
    onSelectedChange,
    onSearch,
    onScrollBottom,

    ...restProps
  } = useComponentProps('Transfer', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { transfer: styleProvider?.transfer }, styleOverrides);

  const itemsMap = useMemo(() => new Map(listProp.map((item) => [item.value, item])), [listProp]);

  const [_valueRight, changeValueRight] = useControlled<V[]>(
    defaultModel ?? [],
    model,
    (value) => {
      if (onModelChange) {
        onModelChange(
          value,
          value.map((v) => itemsMap.get(v) as T),
        );
      }
    },
    undefined,
    formControl?.control,
  );
  const valueRight = useMemo(() => new Set(_valueRight), [_valueRight]);

  const [_selected, changeSelected] = useControlled<V[]>(defaultSelected ?? [], selectedProp, (value) => {
    if (onSelectedChange) {
      onSelectedChange(
        value,
        value.map((v) => itemsMap.get(v) as T),
      );
    }
  });
  const selected = useMemo(() => new Set(_selected), [_selected]);

  const [searchValue, changeSearchValue] = useControlled<[string, string]>(defaultSearchValue ?? ['', ''], searchValueProp, onSearch);

  const { disabled } = useScopedProps({ disabled: disabledProp || formControl?.control.disabled });

  const [list, selectedCount, state] = (() => {
    const list: [T[], T[]] = [[], []];
    const selectedCount = [0, 0];
    const empty = [true, true];
    const allSelected = [true, true];
    const hasSelected = [false, false];

    const filterFn = isUndefined(customSearch?.filter)
      ? (item: T, searchValue: string) => item.label.includes(searchValue)
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (item: T, searchValue: string) => customSearch!.filter!(searchValue, item);
    const sortFn = customSearch?.sort;

    const handleItem = (item: T, index: 0 | 1, noMatch: boolean) => {
      const newItem = Object.assign({ [IS_SELECTED]: false, [NO_MATCH]: noMatch }, item);
      if (selected.has(item.value)) {
        newItem[IS_SELECTED] = true;
        selectedCount[index] += 1;
        if (!item.disabled) {
          hasSelected[index] = true;
        }
      } else {
        if (!item.disabled) {
          allSelected[index] = false;
        }
      }

      list[index].push(newItem);
      if (!item.disabled) {
        empty[index] = false;
      }
    };

    listProp.forEach((item) => {
      if (!valueRight.has(item.value)) {
        if (!searchValue[0] || filterFn(item, searchValue[0])) {
          handleItem(item, 0, false);
        }
      }
    });

    _valueRight.forEach((value) => {
      const item = itemsMap.get(value);
      if (!searchValue[1]) {
        handleItem(item ?? ({ label: value, value } as T), 1, !item);
      } else if (item && filterFn(item, searchValue[1])) {
        handleItem(item, 1, false);
      }
    });

    if (searchValue[0] && sortFn) {
      list[0].sort(sortFn);
    }
    if (searchValue[1] && sortFn) {
      list[1].sort(sortFn);
    }

    const state = [0, 1].map((index) => (empty[index] ? false : allSelected[index] ? true : hasSelected[index] ? 'mixed' : false));

    return [list, selectedCount, state] as const;
  })();

  const handleSelectedChange = (val: V) => {
    changeSelected((draft) => {
      const index = draft.findIndex((v) => v === val);
      if (index !== -1) {
        draft.splice(index, 1);
      } else {
        draft.push(val as V);
      }
    });
  };

  const handleAllSelectedChange = (selected: boolean, isLeft: boolean) => {
    changeSelected((draft) => {
      const newSelected = new Set(draft);
      for (const item of isLeft ? list[0] : list[1]) {
        if (item.disabled) {
          continue;
        }

        if (selected && !(item as any)[IS_SELECTED]) {
          newSelected.add(item.value);
        } else if (!selected && (item as any)[IS_SELECTED]) {
          newSelected.delete(item.value);
        }
      }
      return Array.from(newSelected);
    });
  };

  const handleButtonClick = (isLeft: boolean) => {
    changeValueRight((draft) => {
      if (isLeft) {
        const newValueRight = new Set();
        list[0].forEach((item) => {
          if ((item as any)[IS_SELECTED]) {
            newValueRight.add(item.value);
          }
        });
        return Array.from(newValueRight).concat(draft);
      } else {
        const newValueRight = new Set(draft);
        list[1].forEach((item) => {
          if ((item as any)[IS_SELECTED]) {
            newValueRight.delete(item.value);
          }
        });
        return Array.from(newValueRight);
      }
    });

    changeSelected((draft) => {
      const newSelected = new Set(draft);
      (isLeft ? list[0] : list[1]).forEach((item) => {
        if ((item as any)[IS_SELECTED]) {
          newSelected.delete(item.value);
        }
      });
      return Array.from(newSelected);
    });
  };

  const designProps = useDesign({ form: formControl });

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('transfer', {
          'transfer.is-disabled': disabled,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      {...designProps}
    >
      <TransferPanel
        namespace={namespace}
        styled={styled}
        list={list[0]}
        selectedCount={selectedCount[0]}
        state={state[0]}
        title={title?.[0]}
        loading={loading[0] ?? false}
        searchable={searchable}
        virtual={virtual}
        customItem={customItem}
        onSelectedChange={handleSelectedChange}
        onAllSelectedChange={(selected) => {
          handleAllSelectedChange(selected, true);
        }}
        onSearch={(val) => {
          changeSearchValue((draft) => {
            draft[0] = val;
          });
        }}
        onScrollBottom={() => {
          onScrollBottom?.('left');
        }}
      />
      <div {...styled('transfer__actions')}>
        <Button
          disabled={state[0] === false}
          pattern="secondary"
          icon={
            <Icon>
              <KeyboardArrowRightOutlined />
            </Icon>
          }
          onClick={() => {
            handleButtonClick(true);
          }}
        />
        <Button
          disabled={state[1] === false}
          pattern="secondary"
          icon={
            <Icon>
              <KeyboardArrowLeftOutlined />
            </Icon>
          }
          onClick={() => {
            handleButtonClick(false);
          }}
        />
      </div>
      <TransferPanel
        namespace={namespace}
        styled={styled}
        list={list[1]}
        selectedCount={selectedCount[1]}
        state={state[1]}
        title={title?.[1]}
        loading={loading[1] ?? false}
        searchable={searchable}
        virtual={virtual}
        customItem={customItem}
        onSelectedChange={handleSelectedChange}
        onAllSelectedChange={(selected) => {
          handleAllSelectedChange(selected, false);
        }}
        onSearch={(val) => {
          changeSearchValue((draft) => {
            draft[1] = val;
          });
        }}
        onScrollBottom={() => {
          onScrollBottom?.('right');
        }}
      />
    </div>
  );
}
