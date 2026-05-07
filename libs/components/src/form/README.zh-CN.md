---
title: 表单
---

用于数据收集和校验。

## API

### FormProps

```tsx
interface FormProps extends BaseProps<'form', typeof CLASSES>, React.FormHTMLAttributes<HTMLFormElement> {
  vertical?: boolean;
  labelWidth?: number | string;
  labelWrap?: boolean;
  labelColon?: boolean;
  requiredType?: 'required' | 'optional' | 'hidden';
  feedbackIcon?:
    | boolean
    | {
        success?: React.ReactNode;
        warning?: React.ReactNode;
        error?: React.ReactNode;
        pending?: React.ReactNode;
      };
  size?: Size;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| vertical | 为 `true` 时，表单垂直排列 | `false` |
| labelWidth | 标签的宽度 | `'auto'` |
| labelWrap | 为 `true` 时，标签文本换行 | `false` |
| labelColon | 为 `true` 时，标签后显示冒号 | `true`（水平）/ `false`（垂直） |
| requiredType | 必填字段的显示模式 | `'required'` |
| feedbackIcon | 反馈图标配置 | `false` |
| size | 大小 | `medium` |
<!-- prettier-ignore-end -->

### FormItemProps

```tsx
interface FormItemProps<T extends { [index: string]: FormErrors }>
  extends BaseProps<'form', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode | ((formControls: { [N in keyof T]: FormControlProvider }) => React.ReactNode);
  formControls?: T;
  label?: React.ReactNode;
  labelWidth?: number | string;
  labelWrap?: boolean;
  labelExtra?: { title: string; icon?: React.ReactElement } | string;
  labelFor?: string;
  required?: boolean;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| children | 表单项内容，或接收表单控件的渲染函数 | - |
| formControls | 带有错误消息的表单控件 | - |
| label | 标签文本 | - |
| labelWidth | 标签的宽度 | 继承自 Form |
| labelWrap | 为 `true` 时，标签文本换行 | 继承自 Form |
| labelExtra | 标签的额外信息 | - |
| labelFor | 标签的 `for` 属性 | - |
| required | 为 `true` 时，字段必填 | 自动检测 |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  form: '^form',
  'form--small': '^form--small',
  'form--medium': '^form--medium',
  'form--large': '^form--large',
  form__row: '^form__row',
  form__item: '^form__item',
  'form__item-container': '^form__item-container',
  'form__item-label-wrapper': '^form__item-label-wrapper',
  'form__item-label': '^form__item-label',
  'form__item-label--wrap': '^form__item-label--wrap',
  'form__item-label--required': '^form__item-label--required',
  'form__item-label--colon': '^form__item-label--colon',
  'form__item-label-extra': '^form__item-label-extra',
  'form__item-content': '^form__item-content',
  'form__item-control': '^form__item-control',
  'form__item-feedback-icon': '^form__item-feedback-icon',
  'form__error-container': '^form__error-container',
  form__error: '^form__error',
  'form__error--error': '^form__error--error',
  'form__error--warning': '^form__error--warning',
};
```
