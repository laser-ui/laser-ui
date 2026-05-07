---
group: Data Entry
title: Cascader
aria: combobox
compose: true
virtual-scroll: true
---

A cascading selection component for hierarchical data.

## API

### CascaderRef

```tsx
interface CascaderRef {
  updatePosition: () => void;
}
```

### CascaderItem

```tsx
interface CascaderItem<V extends React.Key> {
  label: string;
  value: V;
  loading?: boolean;
  disabled?: boolean;
  children?: CascaderItem<V>[];
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| label | The display label | - |
| value | The unique value | - |
| loading | If `true`, show loading state | `false` |
| disabled | If `true`, disable the item | `false` |
| children | Nested items | - |
<!-- prettier-ignore-end -->

### CascaderProps

```tsx
interface CascaderProps<V extends React.Key, T extends CascaderItem<V>>
  extends BaseProps<'cascader' | 'cascader-popup', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  ref?: React.Ref<CascaderRef>;
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
  onlyLeafSelectable?: boolean;
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
  onVisibleChange?: (visible: boolean) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onFirstFocus?: (value: V, origin: T) => void;
  onScrollBottom?: (ancestors: V[]) => void;
  afterVisibleChange?: (visible: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| ref | Ref for the component | - |
| formControl | Form support | - |
| list | Configure options | - |
| model | The selected value(s) | - |
| defaultModel | The default selected value(s) | `multiple ? [] : null` |
| visible | If `true`, show the popup | - |
| defaultVisible | The default visibility of the popup | `false` |
| placeholder | The placeholder text | - |
| multiple | If `true`, allow multiple selection | `false` |
| searchable | If `true`, enable search | `false` |
| searchValue | The search value | - |
| defaultSearchValue | The default search value | `''` |
| onlyLeafSelectable | If `true`, only leaf nodes can be selected | `true` |
| clearable | If `true`, show the clear button | `false` |
| loading | If `true`, show loading state | `false` |
| size | The size of the component | - |
| disabled | If `true`, disable the component | `false` |
| virtual | If `true` or a number, enable virtual scrolling | `false` |
| escClosable | If `true`, close the popup on Escape | `true` |
| customItem | Custom render for items | - |
| customSelected | Custom render for selected values | - |
| customSearch | Custom search filter and sort | - |
| inputProps | Props for the input element | - |
| popupRender | Custom render for the popup | - |
| onModelChange | Callback fired when the selection changes | - |
| onVisibleChange | Callback fired when the popup visibility changes | - |
| onSearch | Callback fired when the search value changes | - |
| onClear | Callback fired when the selection is cleared | - |
| onFirstFocus | Callback fired when an item is first focused | - |
| onScrollBottom | Callback fired when scrolling to the bottom | - |
| afterVisibleChange | Callback fired after the visibility animation completes | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  cascader: '^cascader',
  'cascader.is-expanded': 'is-expanded',
  'cascader.is-disabled': 'is-disabled',
  'cascader--small': '^cascader--small',
  'cascader--medium': '^cascader--medium',
  'cascader--large': '^cascader--large',
  cascader__container: '^cascader__container',
  cascader__content: '^cascader__content',
  cascader__search: '^cascader__search',
  'cascader__placeholder-wrapper': '^cascader__placeholder-wrapper',
  cascader__placeholder: '^cascader__placeholder',
  'cascader__multiple-count': '^cascader__multiple-count',
  cascader__close: '^cascader__close',
  cascader__clear: '^cascader__clear',
  cascader__icon: '^cascader__icon',
  cascader__arrow: '^cascader__arrow',
  'cascader-popup': '^cascader-popup',
  'cascader-popup__content': '^cascader-popup__content',
  'cascader-popup__loading': '^cascader-popup__loading',
  'cascader-popup__loading--empty': '^cascader-popup__loading--empty',
  cascader__list: '^cascader__list',
  'cascader__list--inline': '^cascader__list--inline',
  cascader__option: '^cascader__option',
  'cascader__option.is-focused': 'is-focused',
  'cascader__option.is-selected': 'is-selected',
  'cascader__option.is-disabled': 'is-disabled',
  'cascader__option-dot': '^cascader__option-dot',
  'cascader__option-prefix': '^cascader__option-prefix',
  'cascader__option-content': '^cascader__option-content',
  'cascader__option-icon': '^cascader__option-icon',
  cascader__empty: '^cascader__empty',
};
```
