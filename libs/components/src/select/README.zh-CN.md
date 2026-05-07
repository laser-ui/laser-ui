---
title: 选择框
---

用于从列表中选择一项或多项的下拉组件。

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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| label | 显示标签 | - |
| value | 唯一值 | - |
| disabled | 为 `true` 时，禁用该选项 | `false` |
| children | 子选项，用于分组 | - |
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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| ref | 组件的 ref | - |
| formControl | 表单支持 | - |
| list | 选项数据 | - |
| model | 选中值 | - |
| defaultModel | 默认选中值 | `null` 或 `multiple` 时为 `[]` |
| visible | 下拉框是否可见 | - |
| defaultVisible | 默认是否可见 | `false` |
| placeholder | 占位符文本 | - |
| multiple | 为 `true` 时，允许多选 | `false` |
| searchable | 为 `true` 时，允许搜索 | `false` |
| searchValue | 搜索值 | - |
| defaultSearchValue | 默认搜索值 | `''` |
| clearable | 为 `true` 时，显示清除按钮 | `false` |
| loading | 为 `true` 时，显示加载状态 | `false` |
| size | 大小 | `medium` |
| disabled | 为 `true` 时，禁用组件 | `false` |
| monospaced | 为 `true` 时，弹出框宽度与选择框一致 | `true` |
| virtual | 启用虚拟滚动，或指定条目高度 | `false` |
| escClosable | 为 `true` 时，按 Esc 键关闭 | `true` |
| customItem | 自定义选项渲染函数 | - |
| customSelected | 自定义选中项文本渲染函数 | - |
| customSearch | 自定义搜索过滤和排序函数 | - |
| createItem | 从搜索值创建新条目的函数 | - |
| inputProps | 输入元素的额外属性 | - |
| popupRender | 弹出框的自定义渲染函数 | - |
| onModelChange | 选中值改变时的回调函数 | - |
| onVisibleChange | 可见性改变时的回调函数 | - |
| onSearch | 搜索值改变时的回调函数 | - |
| onClear | 点击清除按钮时的回调函数 | - |
| onCreateItem | 创建新条目时的回调函数 | - |
| onScrollBottom | 滚动到底部时的回调函数 | - |
| afterVisibleChange | 可见性改变后的回调函数 | - |
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
