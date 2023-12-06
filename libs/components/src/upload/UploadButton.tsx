import type { UploadButtonProps } from './types';

import AddOutlined from '@material-design-icons/svg/outlined/add.svg?react';
import InsertDriveFileTwoTone from '@material-design-icons/svg/two-tone/insert_drive_file.svg?react';
import { Children, cloneElement, forwardRef } from 'react';

import { UploadAction } from './UploadAction';
import { UploadPreviewAction } from './UploadPreviewAction';
import { BUTTON_CLASSES } from './vars';
import { useComponentProps, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { CircularProgress } from '../internal/circular-progress';
import { mergeCS } from '../utils';

export const UploadButton = forwardRef<HTMLDivElement, UploadButtonProps>((props, ref): JSX.Element | null => {
  const {
    styleOverrides,
    styleProvider,
    file,
    actions,
    defaultActions,
    onRemove,

    ...restProps
  } = useComponentProps('UploadButton', props);

  const styled = useStyled(BUTTON_CLASSES, { 'upload-button': styleProvider?.['upload-button'] }, styleOverrides);

  const { t } = useTranslation();

  const isLoading = file && file.state === 'progress';

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('upload-button', {
          'upload-button.is-disabled': isLoading,
          [`upload-button--${file?.state}`]: file,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      ref={ref}
      tabIndex={restProps.tabIndex ?? (isLoading ? -1 : 0)}
    >
      {file && file.state !== 'progress' ? (
        <>
          {file.thumbUrl ? (
            <img {...styled('upload-button__thumbnail')} src={file.thumbUrl} alt={file.name} />
          ) : (
            <>
              <Icon theme={file.state === 'error' ? 'danger' : 'primary'}>
                <InsertDriveFileTwoTone />
              </Icon>
              <div {...styled('upload-button__name')}>{file.name}</div>
            </>
          )}
          <div {...styled('upload-button__actions')}>
            {Children.map(actions ?? [<UploadPreviewAction />, <UploadAction preset="remove" />], (action) =>
              cloneElement(action as any, {
                _file: file,
                _defaultActions: defaultActions,
                _light: true,
                _onRemove: onRemove,
              }),
            )}
          </div>
        </>
      ) : (
        <>
          <div {...styled('upload-button__icon')}>
            <Icon>{isLoading ? <CircularProgress /> : <AddOutlined />}</Icon>
          </div>
          <div {...styled('upload-button__text')}>{t('Upload', isLoading ? 'Uploading' : 'Upload')}</div>
        </>
      )}
    </div>
  );
});
