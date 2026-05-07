---
group: Data Display
title: Timeline
---

Display a list of events in chronological order.

## API

### TimelineProps

```tsx
interface TimelineItem {
  content: [React.ReactNode, React.ReactNode];
  state?: 'wait' | 'active' | 'completed' | 'warning' | 'error';
  color?: string;
  dot?: React.ReactNode;
}

interface TimelineProps<T extends TimelineItem> extends BaseProps<'timeline', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  list: T[];
  vertical?: boolean;
  lineSize?: number;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| list | The data list | - |
| vertical | If `true`, use vertical layout | `false` |
| lineSize | The size of the track line | `36` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  timeline: '^timeline',
  'timeline--vertical': '^timeline--vertical',
  timeline__content: '^timeline__content',
  'timeline__content--gap': '^timeline__content--gap',
  'timeline__text-container': '^timeline__text-container',
  timeline__text: '^timeline__text',
  'timeline__text--left': '^timeline__text--left',
  'timeline__track-container': '^timeline__track-container',
  timeline__track: '^timeline__track',
  'timeline__track.is-wait': 'is-wait',
  'timeline__track.is-active': 'is-active',
  'timeline__track.is-completed': 'is-completed',
  'timeline__track.is-warning': 'is-warning',
  'timeline__track.is-error': 'is-error',
  timeline__dot: '^timeline__dot',
  timeline__separator: '^timeline__separator',
  'timeline__separator--hidden': '^timeline__separator--hidden',
};
```
