import type { UploadListProps } from './types';

import { useImmer } from '@laser-ui/hooks';
import { ReactComponent as AttachFileOutlined } from '@material-design-icons/svg/outlined/attach_file.svg';
import { isNumber, isUndefined } from 'lodash';
import { Children, cloneElement, useContext } from 'react';

import { UploadAction } from './UploadAction';
import { LIST_CLASSES, UploadContext } from './vars';
import { useComponentProps, useNextTick, useStyled } from '../hooks';
import { Icon } from '../icon';
import { CircularProgress } from '../internal/circular-progress';
import { CollapseTransition } from '../internal/transition';
import { Progress } from '../progress';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export function UploadList(props: UploadListProps): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    actions,
    defaultActions,

    ...restProps
  } = useComponentProps('UploadList', props);

  const styled = useStyled(LIST_CLASSES, { 'upload-list': styleProvider?.['upload-list'] }, styleOverrides);

  const { files, onRemove } = useContext(UploadContext);

  const nextTick = useNextTick();

  const [removeUIDs, setRemoveUIDs] = useImmer<React.Key[]>([]);

  return (
    <ul
      {...restProps}
      {...mergeCS(styled('upload-list'), {
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
                styled('upload-list__item', {
                  [`upload-list__item--${file.state}`]: file.state,
                }),
                {
                  style: collapseStyle,
                },
              )}
              ref={collapseRef}
            >
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
              <div {...styled('upload-list__progress-wrapper')}>
                {isNumber(file.percent) && <Progress percent={file.percent} label={false} lineWidth={2} />}
              </div>
            </li>
          )}
        </CollapseTransition>
      ))}
    </ul>
  );
}
