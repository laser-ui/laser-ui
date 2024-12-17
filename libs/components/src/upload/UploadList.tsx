import type { UploadListProps } from './types';

import AttachFileOutlined from '@material-design-icons/svg/outlined/attach_file.svg?react';
import { has, isNumber, isUndefined } from 'lodash';
import { Fragment, use, useRef } from 'react';

import { UploadAction } from './UploadAction';
import { useNextTick } from './hooks';
import { LIST_CLASSES, UploadActionContext, UploadContext } from './vars';
import { CircularProgress } from '../circular-progress';
import { useComponentProps, useStyled } from '../hooks';
import { Icon } from '../icon';
import { Progress } from '../progress';
import { CollapseTransition } from '../transition';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export function UploadList(props: UploadListProps): React.ReactElement | null {
  const {
    styleOverrides,
    styleProvider,
    actions,
    defaultActions,

    ...restProps
  } = useComponentProps('UploadList', props);

  const styled = useStyled(LIST_CLASSES, { 'upload-list': styleProvider?.['upload-list'] }, styleOverrides);

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
      {...mergeCS(styled('upload-list'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      <div {...styled('upload-list__row')}>
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
                  <li {...styled('upload-list__item', { [`upload-list__item--${file.state}`]: file.state })}>
                    <div {...styled('upload-list__icon')}>
                      {file.state === 'progress' ? (
                        <Icon>
                          <CircularProgress />
                        </Icon>
                      ) : (
                        <Icon rotate={45}>
                          <AttachFileOutlined />
                        </Icon>
                      )}
                    </div>
                    <a
                      {...styled('upload-list__link', {
                        'upload-list__link.is-active': file.state === 'load' && !isUndefined(file.url),
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
                    <div {...styled('upload-list__actions')}>
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
                    <div {...styled('upload-list__progress-wrapper')}>
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
