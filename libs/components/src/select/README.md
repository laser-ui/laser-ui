---
group: Data Entry
title: Select
aria: combobox
compose: true
virtual-scroll: true
---

A dropdown component for selecting one or multiple options from a list.

## API

### SelectItem

```tsx
interface SelectItem<V extends React.Key> {
  label: string;
  value: V;
  disabled?: boolean;
  children?: SelectItem<V>[];
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| label | The display label | - |
| value | The unique value | - |
| disabled | If `true`, disable the option | `false` |
| children | Child options for grouping | - |
<!-- prettier-ignore-end -->

### SelectProps

```tsx
interface SelectProps<V extends React.Key, T extends SelectItem<V>> extends BaseProps<'select' | 'select-popup', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  ref?: React.Ref<SelectRef>;
  formControl?: FormControlProvider;
  list: T[];
  model?: V | null | V[];
  defaultModel?: V | null | V[];
  visible?: boolean;
  defaultVisible?: boolean;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  searchValue?: string;
  defaultSearchValue?: string;
  clearable?: boolean;
  loading?: boolean;
  size?: Size;
  disabled?: boolean;
  monospaced?: boolean;
  virtual?: boolean | number;
  escClosable?: boolean;
  customItem?: (item: T) => React.ReactNode;
  customSelected?: (value: V, selected?: T) => string;
  customSearch?: {
    filter?: (value: string, item: T) => boolean;
    sort?: (a: T, b: T) => number;
  };
  createItem?: (value: string) => T | undefined;
  inputProps?: React.ComponentPropsWithRef<'input'>;
  popupRender?: (el: React.ReactElement) => React.ReactNode;
  onModelChange?: (value: any, origin: any) => void;
  onVisibleChange?: (visible: boolean) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onCreateItem?: (item: T) => void;
  onScrollBottom?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| ref | Ref for the component | - |
| formControl | Form support | - |
| list | The options data | - |
| model | The selected value | - |
| defaultModel | The default selected value | `null` or `[]` when `multiple` |
| visible | Whether the dropdown is visible | - |
| defaultVisible | The default visibility | `false` |
| placeholder | The placeholder text | - |
| multiple | If `true`, allow multiple selection | `false` |
| searchable | If `true`, allow searching | `false` |
| searchValue | The search value | - |
| defaultSearchValue | The default search value | `''` |
| clearable | If `true`, show the clear button | `false` |
| loading | If `true`, show the loading state | `false` |
| size | Size | `medium` |
| disabled | If `true`, disable the component | `false` |
| monospaced | If `true`, the popup width matches the select box | `true` |
| virtual | Enable virtual scroll, or specify the item height | `false` |
| escClosable | If `true`, close on Escape key | `true` |
| customItem | Custom render function for options | - |
| customSelected | Custom render function for selected text | - |
| customSearch | Custom search filter and sort functions | - |
| createItem | Function to create a new item from search value | - |
| inputProps | Additional props for the input element | - |
| popupRender | Custom render function for the popup | - |
| onModelChange | Callback fired when the selected value changes | - |
| onVisibleChange | Callback fired when the visibility changes | - |
| onSearch | Callback fired when the search value changes | - |
| onClear | Callback fired when the clear button is clicked | - |
| onCreateItem | Callback fired when a new item is created | - |
| onScrollBottom | Callback fired when scrolling to the bottom | - |
| afterVisibleChange | Callback fired after the visibility changes | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  select: '^select',
  'select.is-expanded': 'is-expanded',
  'select.is-disabled': 'is-disabled',
  'select--small': '^select--small',
  'select--medium': '^select--medium',
  'select--large': '^select--large',
  select__container: '^select__container',
  select__content: '^select__content',
  select__search: '^select__search',
  'select__placeholder-wrapper': '^select__placeholder-wrapper',
  select__placeholder: '^select__placeholder',
  'select__multiple-count': '^select__multiple-count',
  select__close: '^select__close',
  select__clear: '^select__clear',
  select__icon: '^select__icon',
  select__arrow: '^select__arrow',
  'select-popup': '^select-popup',
  'select-popup__content': '^select-popup__content',
  'select-popup__loading': '^select-popup__loading',
  'select-popup__loading--empty': '^select-popup__loading--empty',
  select__list: '^select__list',
  select__option: '^select__option',
  'select__option.is-selected': 'is-selected',
  'select__option.is-disabled': 'is-disabled',
  'select__option-prefix': '^select__option-prefix',
  'select__option-content': '^select__option-content',
  'select__option-group': '^select__option-group',
  'select__option-group-label': '^select__option-group-label',
  select__empty: '^select__empty',
};
```
