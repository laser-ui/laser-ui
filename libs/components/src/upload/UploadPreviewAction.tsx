import type { UploadPreviewActionProps } from './types';

import VisibilityOutlinedIcon from '@material-design-icons/svg/outlined/visibility.svg?react';
import { isUndefined } from 'lodash';
import { use } from 'react';

import { ACTION_CLASSES, UploadActionContext } from './vars';
import { useComponentProps, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

export function UploadPreviewAction(props: UploadPreviewActionProps): React.ReactElement | null {
  const {
    ref,
    styleOverrides,
    styleProvider,
    children,
    disabled = false,

    ...restProps
  } = useComponentProps('UploadPreviewAction', props);

  const styled = useStyled(ACTION_CLASSES, { 'upload-action': styleProvider?.['upload-action'] }, styleOverrides);

  const { t } = useTranslation();

  const uploadActionContext = use(UploadActionContext);

  return (
    <a
      {...restProps}
      {...mergeCS(
        styled('upload-action', 'upload-action--preview', {
          'upload-action.is-disabled': disabled || isUndefined(uploadActionContext?.file.url),
          'upload-action--light': uploadActionContext?.light,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      ref={ref}
      href={uploadActionContext?.file.url}
      target={restProps['target'] ?? '_blank'}
      title={restProps.title ?? t('Upload', 'Preview file')}
      onClick={(e) => {
        restProps.onClick?.(e);

        e.stopPropagation();
        if (uploadActionContext) {
          if (uploadActionContext.defaultActions?.preview) {
            e.preventDefault();

            uploadActionContext.defaultActions.preview(uploadActionContext.file);
          }
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
}
