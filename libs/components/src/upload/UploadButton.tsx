import type { UploadButtonProps } from './types';

import AddOutlined from '@material-design-icons/svg/outlined/add.svg?react';
import InsertDriveFileTwoTone from '@material-design-icons/svg/two-tone/insert_drive_file.svg?react';
import { has } from 'lodash';
import { Fragment } from 'react';

import { UploadAction } from './UploadAction';
import { UploadPreviewAction } from './UploadPreviewAction';
import { BUTTON_CLASSES, UploadActionContext } from './vars';
import { useComponentProps, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { CircularProgress } from '../internal/circular-progress';
import { mergeCS } from '../utils';

export function UploadButton(props: UploadButtonProps): React.ReactElement | null {
  const {
    ref,
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
            <UploadActionContext
              value={{
                file,
                defaultActions,
                light: true,
                onRemove,
              }}
            >
              {(actions ?? [<UploadPreviewAction />, <UploadAction preset="remove" />]).map((node, index) => {
                const { id, action } = (has(node, ['id', 'action']) ? node : { id: index, action: node }) as {
                  id: React.Key;
                  action: React.ReactNode;
                };
                return <Fragment key={id}>{action}</Fragment>;
              })}
            </UploadActionContext>
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
}
