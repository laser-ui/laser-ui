import type { UploadPictureListProps } from './types';

import InsertDriveFileTwoTone from '@material-design-icons/svg/two-tone/insert_drive_file.svg?react';
import { has, isNumber, isUndefined } from 'lodash';
import { Fragment, use, useRef } from 'react';

import { UploadAction } from './UploadAction';
import { useNextTick } from './hooks';
import { PICTURE_LIST_CLASSES, UploadActionContext, UploadContext } from './vars';
import { CircularProgress } from '../circular-progress';
import { useComponentProps, useStyled } from '../hooks';
import { Icon } from '../icon';
import { Progress } from '../progress';
import { CollapseTransition } from '../transition';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export function UploadPictureList(props: UploadPictureListProps): React.ReactElement | null {
  const {
    styleOverrides,
    styleProvider,
    actions,
    defaultActions,

    ...restProps
  } = useComponentProps('UploadPictureList', props);

  const styled = useStyled(PICTURE_LIST_CLASSES, { 'upload-picture-list': styleProvider?.['upload-picture-list'] }, styleOverrides);

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
      {...mergeCS(styled('upload-picture-list'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      <div {...styled('upload-picture-list__row')}>
        {files.current.map((file, index) => (
          <CollapseTransition
            key={file.uid}
            height={0}
            enter={!(file as any).__removing}
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
                  <li {...styled('upload-picture-list__item', { [`upload-picture-list__item--${file.state}`]: file.state })}>
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
                      <UploadActionContext
                        value={{
                          file,
                          defaultActions,
                          onRemove: () => {
                            (file as any).__removing = true;
                            onRemove(file);
                          },
                        }}
                      >
                        {(actions ? actions(file, index) : [<UploadAction preset="remove" />]).map((node, index) => {
                          const { id, action } = (has(node, ['id', 'action']) ? node : { id: index, action: node }) as {
                            id: React.Key;
                            action: React.ReactNode;
                          };
                          return <Fragment key={id}>{action}</Fragment>;
                        })}
                      </UploadActionContext>
                    </div>
                    <div {...styled('upload-picture-list__progress-wrapper')}>
                      {isNumber(file.percent) && <Progress percent={file.percent} label={false} lineWidth={2} />}
                    </div>
                  </li>
                </div>
              )
            }
          </CollapseTransition>
        ))}
      </div>
    </ul>
  );
}
