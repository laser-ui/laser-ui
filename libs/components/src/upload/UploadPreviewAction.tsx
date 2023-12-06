import type { UploadPreviewActionProps, UploadFile } from './types';

import VisibilityOutlinedIcon from '@material-design-icons/svg/outlined/visibility.svg?react';
import { isUndefined } from 'lodash';
import { forwardRef } from 'react';

import { ACTION_CLASSES } from './vars';
import { useComponentProps, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

export const UploadPreviewAction = forwardRef<HTMLAnchorElement, UploadPreviewActionProps>((props, ref): JSX.Element | null => {
  const {
    styleOverrides,
    styleProvider,
    children,
    disabled = false,

    _file,
    _defaultActions,
    _light,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onRemove,

    ...restProps
  } = useComponentProps(
    'UploadPreviewAction',
    props as UploadPreviewActionProps & {
      _file: UploadFile;
      _defaultActions?: {
        preview?: (file: UploadFile) => void;
        download?: (file: UploadFile) => void;
      };
      _light?: boolean;
      _onRemove?: () => void;
    },
  );

  const styled = useStyled(ACTION_CLASSES, { 'upload-action': styleProvider?.['upload-action'] }, styleOverrides);

  const { t } = useTranslation();

  return (
    <a
      {...restProps}
      {...mergeCS(
        styled('upload-action', 'upload-action--preview', {
          'upload-action.is-disabled': disabled || isUndefined(_file.url),
          'upload-action--light': _light,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      ref={ref}
      href={_file.url}
      target={restProps['target'] ?? '_blank'}
      title={restProps.title ?? t('Upload', 'Preview file')}
      onClick={(e) => {
        restProps.onClick?.(e);

        e.stopPropagation();
        if (_defaultActions?.preview) {
          e.preventDefault();

          _defaultActions.preview(_file);
        }
      }}
    >
      {children ?? (
        <Icon>
          <VisibilityOutlinedIcon />
        </Icon>
      )}
    </a>
  );
});
