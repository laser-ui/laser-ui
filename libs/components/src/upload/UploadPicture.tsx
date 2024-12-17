import type { UploadPictureProps } from './types';

import InsertDriveFileTwoTone from '@material-design-icons/svg/two-tone/insert_drive_file.svg?react';
import { has, isNumber } from 'lodash';
import { Fragment, use, useRef } from 'react';

import { UploadAction } from './UploadAction';
import { UploadPreviewAction } from './UploadPreviewAction';
import { useNextTick } from './hooks';
import { PICTURE_CLASSES, UploadActionContext, UploadContext } from './vars';
import { useComponentProps, useNamespace, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { Progress } from '../progress';
import { Transition } from '../transition';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export function UploadPicture(props: UploadPictureProps): React.ReactElement | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    actions,
    defaultActions,

    ...restProps
  } = useComponentProps('UploadPicture', props);

  const namespace = useNamespace();
  const styled = useStyled(PICTURE_CLASSES, { 'upload-picture': styleProvider?.['upload-picture'] }, styleOverrides);

  const { t } = useTranslation();

  const { files: currentFiles, onRemove } = use(UploadContext);

  const files = useRef(currentFiles);
  {
    const newFiles = currentFiles.map((file) => Object.assign({}, file));
    let index = -1;
    for (const file of files.current) {
      index += 1;
      if ((file as any).__removing) {
        if (files.current[index - 1]?.uid === newFiles[index - 1]?.uid) {
          newFiles.splice(index, 0, file);
        }
      }
    }
    files.current = newFiles;
  }

  const nextTick = useNextTick();

  return (
    <ul
      {...restProps}
      {...mergeCS(styled('upload-picture'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      <div {...styled('upload-picture__row')}>
        {files.current.map((file, index) => (
          <Transition
            key={file.uid}
            enter={!(file as any).__removing}
            name={`${namespace}-upload-picture`}
            duration={TTANSITION_DURING_BASE}
            skipFirstTransition={nextTick.current ? false : true}
            onAfterLeave={() => {
              const index = files.current.findIndex((f) => f.uid === file.uid);
              if (index !== -1) {
                files.current.splice(index, 1);
              }
            }}
          >
            {(transitionRef, leaved) =>
              leaved ? null : (
                <div
                  ref={(instance) => {
                    transitionRef(instance);
                    return () => {
                      transitionRef(null);
                    };
                  }}
                >
                  <li
                    {...styled('upload-picture__item', {
                      [`upload-picture__item--${file.state}`]: file.state,
                      'upload-picture__item.is-disabled': file && file.state === 'progress',
                    })}
                  >
                    {file.state !== 'progress' ? (
                      <>
                        {file.thumbUrl ? (
                          <img {...styled('upload-picture__thumbnail')} src={file.thumbUrl} alt={file.name} />
                        ) : (
                          <>
                            <Icon size={28} theme={file.state === 'error' ? 'danger' : 'primary'}>
                              <InsertDriveFileTwoTone />
                            </Icon>
                            <div {...styled('upload-picture__name')}>{file.name}</div>
                          </>
                        )}
                        <div {...styled('upload-picture__actions')}>
                          <UploadActionContext
                            value={{
                              file,
                              defaultActions,
                              light: true,
                              onRemove: () => {
                                (file as any).__removing = true;
                                onRemove(file);
                              },
                            }}
                          >
                            {(actions ? actions(file, index) : [<UploadPreviewAction />, <UploadAction preset="remove" />]).map(
                              (node, index) => {
                                const { id, action } = (has(node, ['id', 'action']) ? node : { id: index, action: node }) as {
                                  id: React.Key;
                                  action: React.ReactNode;
                                };
                                return <Fragment key={id}>{action}</Fragment>;
                              },
                            )}
                          </UploadActionContext>
                        </div>
                      </>
                    ) : (
                      <>
                        <div {...styled('upload-picture__progress-text')}>{t('Upload', 'Uploading')}</div>
                        {isNumber(file.percent) && (
                          <Progress style={{ width: '100%' }} percent={file.percent} label={false} lineWidth={2} />
                        )}
                      </>
                    )}
                  </li>
                </div>
              )
            }
          </Transition>
        ))}
        <div>{children}</div>
      </div>
    </ul>
  );
}
