---
title: 幻灯片
---

用于循环播放内容的轮播组件。

## API

### SlidesProps

```tsx
interface SlidesAutoplayOptions {
  delay?: number;
  stopOnLast?: boolean;
  pauseOnMouseEnter?: boolean;
}

interface SlidesPaginationOptions {
  visible?: boolean | 'hover';
  dynamic?: boolean;
}

interface SlidesItem<ID extends React.Key> {
  id: ID;
  tooltip?: string;
  content: React.ReactNode;
}

interface SlidesProps<ID extends React.Key, T extends SlidesItem<ID>>
  extends BaseProps<'slides', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  list: T[];
  active?: ID;
  defaultActive?: ID;
  autoplay?: number | SlidesAutoplayOptions;
  arrow?: boolean | 'hover';
  pagination?: boolean | 'hover' | SlidesPaginationOptions;
  vertical?: boolean;
  effect?: 'slide' | 'fade';
  onActiveChange?: (id: ID, origin: T) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| list | 数据列表 | - |
| active | 当前激活项 | - |
| defaultActive | 默认激活项 | `list` 首项 |
| autoplay | 自动播放配置，`0` 禁用 | `0` |
| arrow | 显示箭头，`'hover'` 悬停显示 | `'hover'` |
| pagination | 分页器配置 | `true` |
| vertical | 为 `true` 时，垂直布局 | `false` |
| effect | 动画效果 | `'slide'` |
| onActiveChange | 激活项改变时的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  slides: '^slides',
  'slides--vertical': '^slides--vertical',
  'slides--fade': '^slides--fade',
  slides__container: '^slides__container',
  slides__slide: '^slides__slide',
  slides__arrow: '^slides__arrow',
  'slides__arrow.is-hidden': 'is-hidden',
  'slides__arrow--prev': '^slides__arrow--prev',
  'slides__arrow--next': '^slides__arrow--next',
  slides__pagination: '^slides__pagination',
  'slides__pagination.is-hidden': 'is-hidden',
  'slides__pagination--dynamic': '^slides__pagination--dynamic',
  'slides__pagination-radio': '^slides__pagination-radio',
  'slides__pagination-radio.is-checked': 'is-checked',
  'slides__pagination-radio--prev-1': '^slides__pagination-radio--prev-1',
  'slides__pagination-radio--prev-2': '^slides__pagination-radio--prev-2',
  'slides__pagination-radio--next-1': '^slides__pagination-radio--next-1',
  'slides__pagination-radio--next-2': '^slides__pagination-radio--next-2',
};
```
