---
title: 手风琴
---

垂直堆叠的可展开/折叠列表。

## API

### AccordionItem

```tsx
interface AccordionItem<ID extends React.Key> {
  id: ID;
  title: React.ReactNode;
  region: React.ReactNode;
  arrow?: boolean | 'left';
  disabled?: boolean;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| id | 唯一标识符 | - |
| title | 标题 | - |
| region | 内容 | - |
| arrow | 是否显示箭头及其位置 | - |
| disabled | 为 `true` 时，禁用该项 | `false` |
<!-- prettier-ignore-end -->

### AccordionProps

```tsx
interface AccordionProps<ID extends React.Key, T extends AccordionItem<ID>>
  extends BaseProps<'accordion', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  list: T[];
  active?: ID | null | ID[];
  defaultActive?: ID | null | ID[];
  activeOne?: boolean;
  arrow?: 'left' | 'right' | false;
  lazyLoading?: boolean;
  onActiveChange?: (id: any, origin: any) => void;
  afterActiveChange?: (id: ID, origin: T, active: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| list | 配置选项 | - |
| active | 当前激活的项 | - |
| defaultActive | 默认激活的项 | `activeOne ? null : []` |
| activeOne | 为 `true` 时，同时只能激活一项 | `false` |
| arrow | 默认箭头位置 | `'right'` |
| lazyLoading | 为 `true` 时，延迟渲染内容 | `true` |
| onActiveChange | 激活项改变时的回调函数 | - |
| afterActiveChange | 激活状态动画完成后的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  accordion: '^accordion',
  accordion__item: '^accordion__item',
  'accordion__item-button': '^accordion__item-button',
  'accordion__item-button.is-disabled': 'is-disabled',
  'accordion__item-button--arrow-left': '^accordion__item-button--arrow-left',
  'accordion__item-title': '^accordion__item-title',
  'accordion__item-arrow': '^accordion__item-arrow',
  'accordion__item-region': '^accordion__item-region',
};
```
