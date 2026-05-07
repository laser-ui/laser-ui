---
group: Data Entry
title: Transfer
virtual-scroll: true
---

Transfer items between two lists.

## API

### TransferProps

```tsx
interface TransferItem<V extends React.Key> {
  label: string;
  value: V;
  disabled?: boolean;
}

interface TransferProps<V extends React.Key, T extends TransferItem<V>> extends BaseProps<'transfer', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  formControl?: FormControlProvider;
  list: T[];
  model?: V[];
  defaultModel?: V[];
  selected?: V[];
  defaultSelected?: V[];
  searchable?: boolean;
  searchValue?: [string, string];
  defaultSearchValue?: [string, string];
  title?: [React.ReactNode?, React.ReactNode?];
  loading?: [boolean?, boolean?];
  disabled?: boolean;
  virtual?: boolean | number;
  customItem?: (value: V, item?: T) => React.ReactNode;
  customSearch?: {
    filter?: (value: string, item: T) => boolean;
    sort?: (a: T, b: T) => number;
  };
  onModelChange?: (value: V[], item: T[]) => void;
  onSelectedChange?: (value: V[], item: T[]) => void;
  onSearch?: (value: [string, string]) => void;
  onScrollBottom?: (direction: 'left' | 'right') => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| formControl | Form support | - |
| list | The data source | - |
| model | The selected values on the right panel | `[]` |
| defaultModel | The default selected values on the right panel | `[]` |
| selected | The selected items for transfer | `[]` |
| defaultSelected | The default selected items for transfer | `[]` |
| searchable | If `true`, enable search | `false` |
| searchValue | The search value for both panels | `['', '']` |
| defaultSearchValue | The default search value | `['', '']` |
| title | The title of both panels | - |
| loading | The loading state of both panels | `[false, false]` |
| disabled | If `true`, disable the component | `false` |
| virtual | Enable virtual scroll, or set the item height | `false` |
| customItem | Customize the option rendering | - |
| customSearch | Customize the search filter and sort | - |
| onModelChange | Callback fired when the right panel values change | - |
| onSelectedChange | Callback fired when the selected items change | - |
| onSearch | Callback fired when the search value changes | - |
| onScrollBottom | Callback fired when scrolling to the bottom | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  transfer: '^transfer',
  'transfer.is-disabled': 'is-disabled',
  transfer__panel: '^transfer__panel',
  transfer__actions: '^transfer__actions',
  transfer__header: '^transfer__header',
  'transfer__header-title': '^transfer__header-title',
  transfer__search: '^transfer__search',
  'transfer__list-container': '^transfer__list-container',
  transfer__list: '^transfer__list',
  transfer__loading: '^transfer__loading',
  transfer__option: '^transfer__option',
  'transfer__option.is-disabled': 'is-disabled',
  'transfer__option-prefix': '^transfer__option-prefix',
  'transfer__option-content': '^transfer__option-content',
};
```
