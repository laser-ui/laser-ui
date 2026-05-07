---
title: 级联选择框
---

用于层级数据的级联选择组件。

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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| label | 显示的标签 | - |
| value | 唯一的值 | - |
| loading | 为 `true` 时，显示加载状态 | `false` |
| disabled | 为 `true` 时，禁用该项 | `false` |
| children | 嵌套项 | - |
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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| ref | 组件的 ref | - |
| formControl | 表单支持 | - |
| list | 配置选项 | - |
| model | 选中的值 | - |
| defaultModel | 默认选中的值 | `multiple ? [] : null` |
| visible | 为 `true` 时，显示弹出框 | - |
| defaultVisible | 弹出框的默认可见性 | `false` |
| placeholder | 占位符文本 | - |
| multiple | 为 `true` 时，允许多选 | `false` |
| searchable | 为 `true` 时，启用搜索 | `false` |
| searchValue | 搜索值 | - |
| defaultSearchValue | 默认搜索值 | `''` |
| onlyLeafSelectable | 为 `true` 时，仅叶子节点可选 | `true` |
| clearable | 为 `true` 时，显示清除按钮 | `false` |
| loading | 为 `true` 时，显示加载状态 | `false` |
| size | 组件的大小 | - |
| disabled | 为 `true` 时，禁用组件 | `false` |
| virtual | 为 `true` 或数字时，启用虚拟滚动 | `false` |
| escClosable | 为 `true` 时，按 Escape 关闭弹出框 | `true` |
| customItem | 自定义项渲染 | - |
| customSelected | 自定义选中值渲染 | - |
| customSearch | 自定义搜索过滤和排序 | - |
| inputProps | 输入元素的属性 | - |
| popupRender | 自定义弹出框渲染 | - |
| onModelChange | 选中值改变时的回调函数 | - |
| onVisibleChange | 弹出框可见性改变时的回调函数 | - |
| onSearch | 搜索值改变时的回调函数 | - |
| onClear | 清除时的回调函数 | - |
| onFirstFocus | 首次聚焦项时的回调函数 | - |
| onScrollBottom | 滚动到底部时的回调函数 | - |
| afterVisibleChange | 可见性动画完成后的回调函数 | - |
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
