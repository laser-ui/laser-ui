---
group: Data Entry
title: TreeSelect
aria: combobox
compose: true
virtual-scroll: true
---

Select values from a tree-structured data set.

## API

### TreeSelectProps

```tsx
interface TreeSelectRef {
  updatePosition: () => void;
}

interface TreeSelectProps<V extends React.Key, T extends TreeItem<V>> extends BaseProps<'tree-select' | 'tree' | 'tree-select-popup', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  ref?: React.Ref<TreeSelectRef>;
  formControl?: FormControlProvider;
  list: T[];
  model?: V | null | V[];
  defaultModel?: V | null | V[];
  expands?: V[];
  defaultExpands?: V[];
  visible?: boolean;
  defaultVisible?: boolean;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  searchValue?: string;
  defaultSearchValue?: string;
  onlyLeafSelectable?: boolean;
  showLine?: boolean;
  clearable?: boolean;
  loading?: boolean;
  size?: Size;
  disabled?: boolean;
  virtual?: boolean | number;
  escClosable?: boolean;
  customItem?: (item: T) => React.ReactNode;
  customSelected?: (value: V, selected?: T) => string;
  customSearch?: {
    filter?: (value: string, item: T) => boolean;
    sort?: (a: T, b: T) => number;
  };
  inputProps?: React.ComponentPropsWithRef<'input'>;
  popupRender?: (el: React.ReactElement) => React.ReactNode;
  onModelChange?: (value: any, origin: any) => void;
  onFirstExpand?: (value: V, origin: T) => void;
  onExpandsChange?: (values: V[], origins: T[]) => void;
  onVisibleChange?: (visible: boolean) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
  onScrollBottom?: () => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| formControl | Form support | - |
| list | The tree data | - |
| model | The selected value(s) | `null` / `[]` |
| defaultModel | The default selected value(s) | `null` / `[]` |
| expands | The expanded node values | `[]` |
| defaultExpands | The default expanded node values | `[]` |
| visible | Whether the popup is visible | `false` |
| defaultVisible | The default visibility of the popup | `false` |
| placeholder | The placeholder text | - |
| multiple | If `true`, enable multiple selection | `false` |
| searchable | If `true`, enable search | `false` |
| searchValue | The search value | `''` |
| defaultSearchValue | The default search value | `''` |
| onlyLeafSelectable | If `true`, only leaf nodes can be selected | `true` |
| showLine | If `true`, show connecting lines | `false` |
| clearable | If `true`, show the clear button | `false` |
| loading | If `true`, show the loading state | `false` |
| size | Size | `'medium'` |
| disabled | If `true`, disable the component | `false` |
| virtual | Enable virtual scroll, or set the item height | `false` |
| escClosable | If `true`, close the popup on Escape key | `true` |
| customItem | Customize the option rendering | - |
| customSelected | Customize the selected display | - |
| customSearch | Customize the search filter and sort | - |
| inputProps | Props for the input element | - |
| popupRender | Customize the popup content | - |
| onModelChange | Callback fired when the selected value changes | - |
| onFirstExpand | Callback fired when a node is first expanded | - |
| onExpandsChange | Callback fired when expanded nodes change | - |
| onVisibleChange | Callback fired when the popup visibility changes | - |
| onSearch | Callback fired when the search value changes | - |
| onClear | Callback fired when the clear button is clicked | - |
| afterVisibleChange | Callback fired after the popup visibility animation | - |
| onScrollBottom | Callback fired when scrolling to the bottom | - |
<!-- prettier-ignore-end -->

### TreeSelectRef

```tsx
interface TreeSelectRef {
  updatePosition: () => void;
}
```

### CSS

```tsx
const CLASSES = {
  'tree-select': '^tree-select',
  'tree-select.is-expanded': 'is-expanded',
  'tree-select.is-disabled': 'is-disabled',
  'tree-select--small': '^tree-select--small',
  'tree-select--medium': '^tree-select--medium',
  'tree-select--large': '^tree-select--large',
  'tree-select__container': '^tree-select__container',
  'tree-select__content': '^tree-select__content',
  'tree-select__search': '^tree-select__search',
  'tree-select__placeholder-wrapper': '^tree-select__placeholder-wrapper',
  'tree-select__placeholder': '^tree-select__placeholder',
  'tree-select__multiple-count': '^tree-select__multiple-count',
  'tree-select__close': '^tree-select__close',
  'tree-select__clear': '^tree-select__clear',
  'tree-select__icon': '^tree-select__icon',
  'tree-select__arrow': '^tree-select__arrow',
  'tree-select-popup': '^tree-select-popup',
  'tree-select-popup__content': '^tree-select-popup__content',
  'tree-select-popup__loading': '^tree-select-popup__loading',
  'tree-select-popup__loading--empty': '^tree-select-popup__loading--empty',
  tree: '^tree',
  'tree--line': '^tree--line',
  tree__group: '^tree__group',
  'tree__group--root': '^tree__group--root',
  tree__option: '^tree__option',
  'tree__option.is-selected': 'is-selected',
  'tree__option.is-disabled': 'is-disabled',
  'tree__option--root': '^tree__option--root',
  'tree__option--first': '^tree__option--first',
  'tree__option-dot': '^tree__option-dot',
  'tree__option-icon': '^tree__option-icon',
  'tree__option-arrow': '^tree__option-arrow',
  'tree__option-arrow.is-expand': 'is-expand',
  'tree__option-checkbox': '^tree__option-checkbox',
  'tree__option-content': '^tree__option-content',
  tree__empty: '^tree__empty',
};
```
