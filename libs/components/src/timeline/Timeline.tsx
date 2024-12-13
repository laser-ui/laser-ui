import type { TimelineItem, TimelineProps } from './types';

import { checkNodeExist } from '@laser-ui/utils';
import { Fragment } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export function Timeline<T extends TimelineItem>(props: TimelineProps<T>): React.ReactElement | null {
  const {
    styleOverrides,
    styleProvider,
    list,
    vertical = false,
    lineSize = 36,

    ...restProps
  } = useComponentProps('Timeline', props);

  const styled = useStyled(CLASSES, { timeline: styleProvider?.timeline }, styleOverrides);

  const nodeExist = (() => {
    const hasNode = [false, false];
    for (const item of list) {
      if (checkNodeExist(item.content[0])) {
        hasNode[0] = true;
      }
      if (checkNodeExist(item.content[1])) {
        hasNode[1] = true;
      }
    }
    return hasNode;
  })();

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('timeline', {
          'timeline--vertical': vertical,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
    >
      {vertical ? (
        <>
          {list.map((item, index) => {
            const { state: itemState = 'wait', content: itemContent, color: itemColor, dot: itemDot } = item;

            return (
              <Fragment key={index}>
                <div {...styled('timeline__content')}>
                  {nodeExist[0] && <div {...styled('timeline__text', 'timeline__text--left')}>{itemContent[0]}</div>}
                  <div
                    {...mergeCS(styled('timeline__track', `timeline__track.is-${itemState}`), {
                      style: { ...{ '--color': itemColor }, width: lineSize },
                    })}
                  >
                    <div
                      {...styled('timeline__separator', {
                        'timeline__separator--hidden': index === 0,
                      })}
                    />
                    {checkNodeExist(itemDot) ? itemDot : <div {...styled('timeline__dot')} />}
                    <div
                      {...styled('timeline__separator', {
                        'timeline__separator--hidden': index === list.length - 1,
                      })}
                    />
                  </div>
                  {nodeExist[1] && <div {...styled('timeline__text')}>{itemContent[1]}</div>}
                </div>
                {index !== list.length - 1 && (
                  <div {...styled('timeline__content', 'timeline__content--gap')}>
                    {nodeExist[0] && <div {...styled('timeline__text', 'timeline__text--left')} />}
                    <div {...mergeCS(styled('timeline__track'), { style: { width: lineSize } })}>
                      <div {...styled('timeline__separator')} />
                    </div>
                    {nodeExist[1] && <div {...styled('timeline__text')} />}
                  </div>
                )}
              </Fragment>
            );
          })}
        </>
      ) : (
        <>
          {nodeExist[0] && (
            <div {...styled('timeline__text-container')}>
              {list.map((item, index) => (
                <div {...styled('timeline__text')} key={index}>
                  {item.content[0]}
                </div>
              ))}
            </div>
          )}
          <div
            {...mergeCS(styled('timeline__track-container'), {
              style: { height: lineSize },
            })}
          >
            {list.map((item, index) => {
              const { state: itemState = 'wait', color: itemColor, dot: itemDot } = item;

              return (
                <div
                  {...mergeCS(styled('timeline__track', `timeline__track.is-${itemState}`), {
                    style: { ...({ '--color': itemColor } as any) },
                  })}
                  key={index}
                >
                  <div
                    {...styled('timeline__separator', {
                      'timeline__separator--hidden': index === 0,
                    })}
                  />
                  {checkNodeExist(itemDot) ? itemDot : <div {...styled('timeline__dot')} />}
                  <div
                    {...styled('timeline__separator', {
                      'timeline__separator--hidden': index === list.length - 1,
                    })}
                  />
                </div>
              );
            })}
          </div>
          {nodeExist[1] && (
            <div {...styled('timeline__text-container')}>
              {list.map((item, index) => (
                <div {...styled('timeline__text')} key={index}>
                  {item.content[1]}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
