import type { UploadActionProps } from './types';

import { saveFile } from '@laser-ui/utils';
import DeleteOutlineOutlined from '@material-design-icons/svg/outlined/delete_outline.svg?react';
import FileDownloadOutlined from '@material-design-icons/svg/outlined/file_download.svg?react';
import { isUndefined } from 'lodash';
import { use } from 'react';

import { ACTION_CLASSES, UploadActionContext } from './vars';
import { useComponentProps, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

export function UploadAction(props: UploadActionProps): React.ReactElement | null {
  const {
    ref,
    styleOverrides,
    styleProvider,
    children,
    preset,
    disabled: disabledProp = false,

    ...restProps
  } = useComponentProps('UploadAction', props);

  const styled = useStyled(ACTION_CLASSES, { 'upload-action': styleProvider?.['upload-action'] }, styleOverrides);

  const { t } = useTranslation();

  const uploadActionContext = use(UploadActionContext);

  const disabled = preset === 'download' ? disabledProp || isUndefined(uploadActionContext?.file.url) : disabledProp;

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('upload-action', {
          'upload-action.is-disabled': disabled,
          'upload-action--light': uploadActionContext?.light,
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
        (restProps.title ?? preset === 'download')
          ? t('Upload', 'Download file')
          : preset === 'remove'
            ? t('Upload', 'Remove file')
            : undefined
      }
      onClick={(e) => {
        restProps.onClick?.(e);

        e.stopPropagation();
        if (uploadActionContext) {
          if (preset === 'download') {
            if (uploadActionContext.defaultActions?.download) {
              uploadActionContext.defaultActions.download(uploadActionContext.file);
            } else {
              saveFile(uploadActionContext.file.url as string, uploadActionContext.file.name);
            }
          } else if (preset === 'remove') {
            uploadActionContext.onRemove?.();
          }
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
}
