---
group: Navigation
title: Anchor
aria: navigation
---

A navigation component for jumping to page anchors.

## API

### AnchorRef

```tsx
interface AnchorRef {
  active: string | null;
  updateAnchor: () => void;
}
```

### AnchorItem

```tsx
interface AnchorItem {
  href: string;
  title?: React.ReactNode;
  target?: string;
  children?: AnchorItem[];
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| href | The target anchor ID | - |
| title | The display title | - |
| target | The `target` attribute of the link | - |
| children | Nested anchor items | - |
<!-- prettier-ignore-end -->

### AnchorProps

```tsx
interface AnchorProps<T extends AnchorItem>
  extends BaseProps<'anchor', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLUListElement>, 'children' | 'onClick'> {
  ref?: React.Ref<AnchorRef>;
  list: T[];
  page?: RefExtra;
  distance?: number | string;
  scrollBehavior?: 'instant' | 'smooth';
  indicator?: React.ReactNode | typeof DOT_INDICATOR | typeof LINE_INDICATOR;
  onClick?: (href: string, origin: T) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| ref | Ref for the component | - |
| list | Configure anchor items | - |
| page | The scroll container element | `window` |
| distance | Offset from the top when scrolling | `0` |
| scrollBehavior | The scroll behavior | `'instant'` |
| indicator | The active indicator style | `DOT_INDICATOR` |
| onClick | Callback fired when an anchor is clicked | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  anchor: '^anchor',
  anchor__link: '^anchor__link',
  'anchor__link.is-active': 'is-active',
  'anchor__indicator-track': '^anchor__indicator-track',
  'anchor__indicator-wrapper': '^anchor__indicator-wrapper',
  'anchor__dot-indicator': '^anchor__dot-indicator',
  'anchor__line-indicator': '^anchor__line-indicator',
};
```
