import type { ModalAlertProps } from './types';

import { checkNodeExist } from '@laser-ui/utils';
import { ReactComponent as CheckCircleOutlined } from '@material-design-icons/svg/outlined/check_circle.svg';
import { ReactComponent as HighlightOffOutlined } from '@material-design-icons/svg/outlined/highlight_off.svg';
import { ReactComponent as InfoOutlined } from '@material-design-icons/svg/outlined/info.svg';
import { ReactComponent as WarningAmberOutlined } from '@material-design-icons/svg/outlined/warning_amber.svg';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

export function ModalAlert(props: ModalAlertProps): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    children,
    type,
    title,
    icon,

    ...restProps
  } = useComponentProps('ModalAlert', props);

  const styled = useStyled(CLASSES, { modal: styleProvider?.modal }, styleOverrides);

  return (
    <div
      {...restProps}
      {...mergeCS(styled('modal__alert', `modal__alert--${type}`), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      <div {...styled('modal__alert-icon')}>
        {checkNodeExist(icon) ? (
          icon
        ) : (
          <Icon>
            {type === 'success' ? (
              <CheckCircleOutlined />
            ) : type === 'warning' ? (
              <WarningAmberOutlined />
            ) : type === 'error' ? (
              <HighlightOffOutlined />
            ) : (
              <InfoOutlined />
            )}
          </Icon>
        )}
      </div>
      <div {...styled('modal__alert-content')}>
        {checkNodeExist(title) && <div {...styled('modal__alert-title')}>{title}</div>}
        {checkNodeExist(children) && <div {...styled('modal__alert-message')}>{children}</div>}
      </div>
    </div>
  );
}
