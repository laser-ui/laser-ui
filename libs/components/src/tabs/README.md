---
group: Navigation
title: Tabs
aria: tabpanels
---

A tabs component for switching between different content panels.

## API

### TabsProps

```tsx
interface TabsRef {
  updateIndicator: () => void;
}

interface TabsItem<ID extends React.Key> {
  id: ID;
  title: React.ReactNode;
  panel: React.ReactNode;
  dropdownRender?: React.ReactNode;
  closable?: boolean;
  disabled?: boolean;
}

interface TabsProps<ID extends React.Key, T extends TabsItem<ID>>
  extends BaseProps<'tabs', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  ref?: React.Ref<TabsRef>;
  list: T[];
  active?: ID;
  defaultActive?: ID;
  pattern?: 'wrap' | 'slider';
  placement?: 'top' | 'right' | 'bottom' | 'left';
  center?: boolean;
  size?: Size;
  addible?: boolean;
  lazyLoading?: boolean;
  onActiveChange?: (id: ID, origin: T) => void;
  onAddClick?: () => void;
  onClose?: (id: ID, origin: T) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| list | The tab data list | - |
| active | The active tab | - |
| defaultActive | The default active tab | The first non-disabled tab |
| pattern | The pattern of the tabs | - |
| placement | The placement of the tab list | `'top'` |
| center | If `true`, center the tabs | `false` |
| size | Size | `'medium'` |
| addible | If `true`, show the add button | `false` |
| lazyLoading | If `true`, lazy load the panel content | `true` |
| onActiveChange | Callback fired when the active tab changes | - |
| onAddClick | Callback fired when the add button is clicked | - |
| onClose | Callback fired when a tab is closed | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  tabs: '^tabs',
  'tabs--wrap': '^tabs--wrap',
  'tabs--slider': '^tabs--slider',
  'tabs--top': '^tabs--top',
  'tabs--right': '^tabs--right',
  'tabs--bottom': '^tabs--bottom',
  'tabs--left': '^tabs--left',
  'tabs--small': '^tabs--small',
  'tabs--medium': '^tabs--medium',
  'tabs--large': '^tabs--large',
  'tabs--center': '^tabs--center',
  'tabs__tablist-wrapper': '^tabs__tablist-wrapper',
  tabs__tablist: '^tabs__tablist',
  tabs__tab: '^tabs__tab',
  'tabs__tab.is-active': 'is-active',
  'tabs__tab.is-disabled': 'is-disabled',
  'tabs__tab--first': '^tabs__tab--first',
  'tabs__tab--last': '^tabs__tab--last',
  tabs__close: '^tabs__close',
  'tabs__button-container': '^tabs__button-container',
  tabs__button: '^tabs__button',
  'tabs__button.is-end': 'is-end',
  'tabs__button--more': '^tabs__button--more',
  'tabs__button--add': '^tabs__button--add',
  tabs__indicator: '^tabs__indicator',
  'tabs__wrap-indicator': '^tabs__wrap-indicator',
  'tabs__slider-indicator': '^tabs__slider-indicator',
  tabs__tabpanel: '^tabs__tabpanel',
};
```
