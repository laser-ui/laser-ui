---
group: Data Display
title: Slides
aria: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
---

A carousel component for cycling through content.

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
| Property | Description | Default |
| --- | --- | --- |
| list | The data list | - |
| active | The active item | - |
| defaultActive | The default active item | The first item of `list` |
| autoplay | Autoplay configuration, `0` to disable | `0` |
| arrow | Show arrows, `'hover'` to show on hover | `'hover'` |
| pagination | Pagination configuration | `true` |
| vertical | If `true`, vertical layout | `false` |
| effect | Animation effect | `'slide'` |
| onActiveChange | Callback fired when the active item changes | - |
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
