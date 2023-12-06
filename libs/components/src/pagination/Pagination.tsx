import type { PaginationProps } from './types';

import KeyboardArrowLeftOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_left.svg?react';
import KeyboardArrowRightOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_right.svg?react';
import KeyboardDoubleArrowLeftOutlined from '@material-design-icons/svg/outlined/keyboard_double_arrow_left.svg?react';
import KeyboardDoubleArrowRightOutlined from '@material-design-icons/svg/outlined/keyboard_double_arrow_right.svg?react';
import MoreHorizOutlined from '@material-design-icons/svg/outlined/more_horiz.svg?react';
import { isNull, isNumber } from 'lodash';
import { Fragment, cloneElement, useRef, useState } from 'react';

import { buttonProps } from './utils';
import { CLASSES } from './vars';
import { useComponentProps, useControlled, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { Input } from '../input';
import { Select } from '../select';
import { mergeCS } from '../utils';

export function Pagination(props: PaginationProps): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    total,
    active: activeProp,
    defaultActive,
    pageSize: pageSizeProp,
    defaultPageSize,
    pageSizeList = [10, 20, 50, 100],
    compose = ['pages'],
    customRender,
    mini = false,
    onChange,

    ...restProps
  } = useComponentProps('Pagination', props);

  const styled = useStyled(CLASSES, { pagination: styleProvider?.pagination }, styleOverrides);

  const { t } = useTranslation();

  const navRef = useRef<HTMLElement>(null);

  const [active, _changeActive] = useControlled<number>(defaultActive ?? 1, activeProp);
  const changeActive = (val: number) => {
    const newActive = Math.max(Math.min(val, lastPage), 1);
    _changeActive(newActive);

    if (!Object.is(newActive, active)) {
      onChange?.(newActive, pageSize);
    }
  };

  const [pageSize, _changePageSize] = useControlled<number>(defaultPageSize ?? pageSizeList[0], pageSizeProp);
  const changePageSize = (val: number) => {
    _changePageSize(val);

    const lastPage = Math.max(Math.ceil(total / val), 1);
    const newActive = Math.max(Math.min(active, lastPage), 1);

    if (!Object.is(newActive, active) || !Object.is(val, pageSize)) {
      onChange?.(newActive, val);
    }
  };

  const [jumpValue, setJumpValue] = useState<number | null>(null);
  const lastPage = Math.max(Math.ceil(total / pageSize), 1);

  return (
    <nav
      {...restProps}
      {...mergeCS(
        styled('pagination', {
          'pagination--mini': mini,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      ref={navRef}
      role="navigation"
      aria-label={restProps['aria-label'] ?? 'Pagination Navigation'}
    >
      <div {...styled('pagination__row')}>
        {compose.map((item, index) => {
          const gap = index === compose.length - 1 ? undefined : mini ? 2 : 6;

          if (item === 'total') {
            const totalNode = (() => {
              const range: [number, number] = [Math.min((active - 1) * pageSize + 1, total), Math.min(active * pageSize, total)];
              if (customRender && customRender.total) {
                return customRender.total(range);
              } else {
                return `${t('Pagination', 'Total')} ${total} ${t('Pagination', 'items')}`;
              }
            })();

            return (
              <div key="total">
                <div style={{ paddingRight: gap }}>{totalNode}</div>
              </div>
            );
          }

          if (item === 'pages') {
            const [prevNode, pageNode, nextNode] = [
              <li
                {...styled('pagination__button', {
                  'pagination__button.is-disabled': active === 1,
                  'pagination__button--border': !(customRender && customRender.prev),
                })}
                {...buttonProps(() => {
                  changeActive(active - 1);
                }, active === 1)}
                title={t('Pagination', 'Previous page')}
              >
                {customRender && customRender.prev ? (
                  customRender.prev
                ) : (
                  <Icon>
                    <KeyboardArrowLeftOutlined />
                  </Icon>
                )}
              </li>,
              (page: number) => {
                if (customRender && customRender.page) {
                  return customRender.page(page);
                } else {
                  return <div>{page}</div>;
                }
              },
              <li
                {...styled('pagination__button', {
                  'pagination__button.is-disabled': active === lastPage,
                  'pagination__button--border': !(customRender && customRender.next),
                })}
                {...buttonProps(() => {
                  changeActive(active + 1);
                }, active === lastPage)}
                title={t('Pagination', 'Next page')}
              >
                {customRender && customRender.next ? (
                  customRender.next
                ) : (
                  <Icon>
                    <KeyboardArrowRightOutlined />
                  </Icon>
                )}
              </li>,
            ];

            let pages: number[] = [];

            if (lastPage <= 7) {
              pages = Array.from({ length: lastPage }).map((_, index) => index + 1);
            } else {
              for (let n = -3; n <= 3; n++) {
                pages.push(active + n);
              }

              if (pages[0] < 1) {
                pages = pages.map((n) => n + (1 - pages[0]));
              }
              if (pages[6] > lastPage) {
                pages = pages.map((n) => n - (pages[6] - lastPage));
              }

              if (pages[0] > 1) {
                pages[0] = 1;
                pages[1] = 'prev5' as any;
              }
              if (pages[6] < lastPage) {
                pages[6] = lastPage;
                pages[5] = 'next5' as any;
              }
            }

            return (
              <Fragment key="pages">
                <div>{prevNode}</div>
                {(pages as (number | 'prev5' | 'next5')[]).map((n) => {
                  if (n === 'prev5') {
                    return (
                      <div key="prev5">
                        <li
                          {...styled('pagination__button', 'pagination__button--jump5')}
                          {...buttonProps(() => {
                            changeActive(active - 5);
                          })}
                          title={t('Pagination', '5 pages forward')}
                        >
                          <Icon {...styled('pagination__jump5-icon')}>
                            <KeyboardDoubleArrowLeftOutlined />
                          </Icon>
                          <div {...styled('pagination__ellipsis')}>
                            <Icon>
                              <MoreHorizOutlined />
                            </Icon>
                          </div>
                        </li>
                      </div>
                    );
                  } else if (n === 'next5') {
                    return (
                      <div key="next5">
                        <li
                          {...styled('pagination__button', 'pagination__button--jump5')}
                          {...buttonProps(() => {
                            changeActive(active + 5);
                          })}
                          title={t('Pagination', '5 pages backward')}
                        >
                          <Icon {...styled('pagination__jump5-icon')}>
                            <KeyboardDoubleArrowRightOutlined />
                          </Icon>
                          <div {...styled('pagination__ellipsis')}>
                            <Icon>
                              <MoreHorizOutlined />
                            </Icon>
                          </div>
                        </li>
                      </div>
                    );
                  } else {
                    return (
                      <div key={n}>
                        <li
                          {...styled('pagination__button', 'pagination__button--border', 'pagination__button--number', {
                            'pagination__button.is-active': active === n,
                          })}
                          tabIndex={0}
                          data-number={n}
                          onClick={() => {
                            changeActive(n);
                          }}
                          onKeyDown={(e) => {
                            const focusN = (num: number) => {
                              if (navRef.current) {
                                const activeEl = navRef.current.querySelector(`li[data-number="${num}"]`) as HTMLElement | null;
                                activeEl?.focus({ preventScroll: true });
                              }
                              changeActive(num);
                            };
                            switch (e.code) {
                              case 'ArrowLeft':
                                e.preventDefault();
                                focusN(n - 1);
                                break;

                              case 'ArrowRight':
                                e.preventDefault();
                                focusN(n + 1);
                                break;

                              case 'Home':
                                e.preventDefault();
                                focusN(1);
                                break;

                              case 'End':
                                e.preventDefault();
                                focusN(lastPage);
                                break;

                              default:
                                break;
                            }
                          }}
                        >
                          {pageNode(n)}
                        </li>
                      </div>
                    );
                  }
                })}
                <div>
                  <div style={{ paddingRight: gap }}>{nextNode}</div>
                </div>
              </Fragment>
            );
          }

          if (item === 'page-size') {
            const list = pageSizeList.map((size) => ({
              label: size.toString(),
              value: size,
            }));

            return (
              <div key="page-size">
                <div style={{ paddingRight: gap }}>
                  <Select
                    list={list}
                    model={pageSize}
                    size={mini ? 'small' : undefined}
                    customItem={(item) => (customRender && customRender.pageSize ? customRender.pageSize(item.value) : item.label)}
                    customSelected={(select) => `${select.label}${t('Pagination', ' / Page')}`}
                    onModelChange={(value) => {
                      if (!isNull(value)) {
                        changePageSize(value);
                      }
                    }}
                  />
                </div>
              </div>
            );
          }

          if (item === 'jump') {
            const jumpNode = (() => {
              const jumpInput = (
                <Input.Number
                  style={{ width: mini ? 48 : 72 }}
                  model={jumpValue}
                  max={lastPage}
                  min={1}
                  step={1}
                  size={mini ? 'small' : undefined}
                  numberButton={!mini}
                  inputRender={(el) =>
                    cloneElement<React.HTMLAttributes<HTMLElement>>(el, {
                      onKeyDown: (e) => {
                        el.props.onKeyDown?.(e);

                        if (e.code === 'Enter') {
                          e.preventDefault();

                          if (isNumber(jumpValue)) {
                            changeActive(jumpValue);
                          }
                        }
                      },
                    })
                  }
                  onModelChange={setJumpValue}
                />
              );

              if (customRender && customRender.jump) {
                return customRender.jump(jumpInput);
              } else {
                return (
                  <div {...styled('pagination__jump')}>
                    <span>{t('Pagination', 'Go')}</span>
                    {jumpInput}
                    <span>{t('Pagination', 'Page')}</span>
                  </div>
                );
              }
            })();

            return (
              <div key="jump">
                <div style={{ paddingRight: gap }}>{jumpNode}</div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </nav>
  );
}
