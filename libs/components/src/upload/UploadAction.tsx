import type { UploadActionProps, UploadFile } from './types';

import { saveFile } from '@laser-ui/utils';
import { ReactComponent as DeleteOutlineOutlined } from '@material-design-icons/svg/outlined/delete_outline.svg';
import { ReactComponent as FileDownloadOutlined } from '@material-design-icons/svg/outlined/file_download.svg';
import { isUndefined } from 'lodash';
import { forwardRef } from 'react';

import { ACTION_CLASSES } from './vars';
import { useComponentProps, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

export const UploadAction = forwardRef<HTMLDivElement, UploadActionProps>((props, ref): JSX.Element | null => {
  const {
    styleOverrides,
    styleProvider,
    children,
    preset,
    disabled: disabledProp = false,

    _file,
    _defaultActions,
    _light,
    _onRemove,

    ...restProps
  } = useComponentProps(
    'UploadAction',
    props as UploadActionProps & {
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

  const disabled = preset === 'download' ? disabledProp || isUndefined(_file.url) : disabledProp;

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('upload-action', {
          'upload-action.is-disabled': disabled,
          'upload-action--light': _light,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      ref={ref}
      role={restProps['role'] ?? 'button'}
      tabIndex={restProps['tabIndex'] ?? (disabled ? -1 : 0)}
      title={
        restProps.title ?? preset === 'download'
          ? t('Upload', 'Download file')
          : preset === 'remove'
          ? t('Upload', 'Remove file')
          : undefined
      }
      onClick={(e) => {
        restProps.onClick?.(e);

        e.stopPropagation();
        if (preset === 'download') {
          if (_defaultActions?.download) {
            _defaultActions.download(_file);
          } else {
            saveFile(_file.url as string, _file.name);
          }
        } else if (preset === 'remove') {
          _onRemove?.();
        }
      }}
    >
      {children ??
        (preset === 'download' ? (
          <Icon>
            <FileDownloadOutlined />
          </Icon>
        ) : preset === 'remove' ? (
          <Icon>
            <DeleteOutlineOutlined />
          </Icon>
        ) : null)}
    </div>
  );
});
