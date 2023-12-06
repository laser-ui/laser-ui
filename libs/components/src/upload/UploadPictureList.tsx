import type { UploadPictureListProps } from './types';

import { useImmer } from '@laser-ui/hooks';
import InsertDriveFileTwoTone from '@material-design-icons/svg/two-tone/insert_drive_file.svg?react';
import { isNumber, isUndefined } from 'lodash';
import { Children, cloneElement, useContext } from 'react';

import { UploadAction } from './UploadAction';
import { PICTURE_LIST_CLASSES, UploadContext } from './vars';
import { useComponentProps, useNextTick, useStyled } from '../hooks';
import { Icon } from '../icon';
import { CircularProgress } from '../internal/circular-progress';
import { CollapseTransition } from '../internal/transition';
import { Progress } from '../progress';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export function UploadPictureList(props: UploadPictureListProps): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    actions,
    defaultActions,

    ...restProps
  } = useComponentProps('UploadPictureList', props);

  const styled = useStyled(PICTURE_LIST_CLASSES, { 'upload-picture-list': styleProvider?.['upload-picture-list'] }, styleOverrides);

  const { files, onRemove } = useContext(UploadContext);

  const nextTick = useNextTick();

  const [removeUIDs, setRemoveUIDs] = useImmer<React.Key[]>([]);

  return (
    <ul
      {...restProps}
      {...mergeCS(styled('upload-picture-list'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      {files.map((file, index) => (
        <CollapseTransition
          key={file.uid}
          originalSize={{
            height: 'auto',
          }}
          collapsedSize={{
            height: 0,
          }}
          enter={!removeUIDs.includes(file.uid)}
          during={TTANSITION_DURING_BASE}
          styles={{
            entering: {
              transition: ['height', 'padding', 'margin'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-out`).join(', '),
            },
            leaving: {
              transition: ['height', 'padding', 'margin'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-in`).join(', '),
            },
            leaved: { display: 'none' },
          }}
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
          {(collapseRef, collapseStyle) => (
            <li
              {...mergeCS(
                styled('upload-picture-list__item', {
                  [`upload-picture-list__item--${file.state}`]: file.state,
                }),
                {
                  style: collapseStyle,
                },
              )}
              ref={collapseRef}
            >
              <div {...styled('upload-picture-list__thumbnail')}>
                {file.state === 'progress' ? (
                  <Icon size={28}>
                    <CircularProgress />
                  </Icon>
                ) : file.thumbUrl ? (
                  <img {...styled('upload-picture-list__thumbnail-img')} src={file.thumbUrl} alt={file.name} />
                ) : (
                  <Icon size={28} theme={file.state === 'error' ? 'danger' : 'primary'}>
                    <InsertDriveFileTwoTone />
                  </Icon>
                )}
              </div>
              <a
                {...styled('upload-picture-list__link', {
                  'upload-picture-list__link.is-active': file.state === 'load' && !isUndefined(file.url),
                })}
                href={file.url}
                target="_blank"
                rel="noreferrer"
                title={file.name}
                onClick={(e) => {
                  if (defaultActions && defaultActions.preview) {
                    e.preventDefault();

                    defaultActions.preview(file);
                  }
                }}
              >
                {file.name}
              </a>
              <div {...styled('upload-picture-list__actions')}>
                {Children.map(actions ? actions(file, index) : [<UploadAction preset="remove" />], (action: any) =>
                  cloneElement(action, {
                    _file: file,
                    _defaultActions: defaultActions,
                    _onRemove: () => {
                      setRemoveUIDs((draft) => {
                        draft.push(file.uid);
                      });
                    },
                  }),
                )}
              </div>
              <div {...styled('upload-picture-list__progress-wrapper')}>
                {isNumber(file.percent) && <Progress percent={file.percent} label={false} lineWidth={2} />}
              </div>
            </li>
          )}
        </CollapseTransition>
      ))}
    </ul>
  );
}
