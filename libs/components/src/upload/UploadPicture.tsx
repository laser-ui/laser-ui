import type { UploadPictureProps } from './types';

import { useImmer } from '@laser-ui/hooks';
import { ReactComponent as InsertDriveFileTwoTone } from '@material-design-icons/svg/two-tone/insert_drive_file.svg';
import { isNumber } from 'lodash';
import { Children, cloneElement, useContext } from 'react';

import { UploadAction } from './UploadAction';
import { UploadPreviewAction } from './UploadPreviewAction';
import { PICTURE_CLASSES, UploadContext } from './vars';
import { useComponentProps, useNextTick, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { Transition } from '../internal/transition';
import { Progress } from '../progress';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export function UploadPicture(props: UploadPictureProps): JSX.Element | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    actions,
    defaultActions,

    ...restProps
  } = useComponentProps('UploadPicture', props);

  const styled = useStyled(PICTURE_CLASSES, { 'upload-picture': styleProvider?.['upload-picture'] }, styleOverrides);

  const { t } = useTranslation();

  const { files, onRemove } = useContext(UploadContext);

  const nextTick = useNextTick();

  const [removeUIDs, setRemoveUIDs] = useImmer<React.Key[]>([]);

  return (
    <ul
      {...restProps}
      {...mergeCS(styled('upload-picture'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      <div {...styled('upload-picture__row')}>
        {files.map((file, index) => (
          <Transition
            key={file.uid}
            enter={!removeUIDs.includes(file.uid)}
            during={TTANSITION_DURING_BASE}
            skipFirstTransition={nextTick.current ? false : true}
            afterLeave={() => {
              setRemoveUIDs((draft) => {
                draft.splice(
                  draft.findIndex((uid) => uid === file.uid),
                  1,
                );
              });
              onRemove(file);
            }}
          >
            {(state) => {
              let transitionStyle: React.CSSProperties = {};
              switch (state) {
                case 'enter':
                  transitionStyle = { transform: 'scale(0)' };
                  break;

                case 'entering':
                  transitionStyle = {
                    transition: ['transform'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-out`).join(', '),
                    transformOrigin: 'top left',
                  };
                  break;

                case 'leaving':
                  transitionStyle = {
                    transform: 'scale(0)',
                    transition: ['transform'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-in`).join(', '),
                    transformOrigin: 'top left',
                  };
                  break;

                case 'leaved':
                  transitionStyle = { display: 'none' };
                  break;

                default:
                  break;
              }

              return (
                <div>
                  <li
                    {...mergeCS(
                      styled('upload-picture__item', {
                        [`upload-picture__item--${file.state}`]: file.state,
                        'upload-picture__item.is-disabled': file && file.state === 'progress',
                      }),
                      {
                        style: transitionStyle,
                      },
                    )}
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
                          {Children.map(
                            actions ? actions(file, index) : [<UploadPreviewAction />, <UploadAction preset="remove" />],
                            (action: any) =>
                              cloneElement(action, {
                                _file: file,
                                _defaultActions: defaultActions,
                                _light: true,
                                _onRemove: () => {
                                  setRemoveUIDs((draft) => {
                                    draft.push(file.uid);
                                  });
                                },
                              }),
                          )}
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
              );
            }}
          </Transition>
        ))}
        <div>{children}</div>
      </div>
    </ul>
  );
}
