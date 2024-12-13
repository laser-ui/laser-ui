import type { Styled } from '../../hooks/useStyled';
import type { CLASSES } from '../vars';
import type { UnitType } from 'dayjs';

import { useAsync, useEvent, useRefExtra } from '@laser-ui/hooks';
import KeyboardArrowLeftOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_left.svg?react';
import KeyboardArrowRightOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_right.svg?react';
import KeyboardDoubleArrowLeftOutlined from '@material-design-icons/svg/outlined/keyboard_double_arrow_left.svg?react';
import KeyboardDoubleArrowRightOutlined from '@material-design-icons/svg/outlined/keyboard_double_arrow_right.svg?react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import dayjs from '../../dayjs';
import { useTranslation } from '../../hooks';
import { Icon } from '../../icon';

interface DatePickerPanelProps {
  styled: Styled<typeof CLASSES>;
  currentSelected: Date | null;
  anotherSelected: Date | null;
  config: ((date: Date) => { disabled?: boolean }) | undefined;
  range: boolean;
  onDateChange: (date: Date) => void;
}

export const DatePickerPanel = forwardRef<(date: Date) => void, DatePickerPanelProps>((props, ref): React.ReactElement | null => {
  const { styled, currentSelected: currentSelectedProp, anotherSelected: anotherSelectedProp, config, range, onDateChange } = props;

  const dataRef = useRef<{
    clearLoop?: () => void;
    clearTid?: () => void;
    clearHoverTid?: () => void;
  }>({});

  const { t, lang } = useTranslation();
  const async = useAsync();

  const windowRef = useRefExtra(() => window);

  const currentSelected = currentSelectedProp ? dayjs(currentSelectedProp) : dayjs().set('hour', 0).set('minute', 0).set('second', 0);
  const anotherSelected = anotherSelectedProp ? dayjs(anotherSelectedProp) : null;

  const [_active, setActive] = useState<Date>(currentSelected.toDate());
  const active = dayjs(_active);

  const [hover, setHover] = useState<Date | null>(null);

  const handleMouseDown = (unit: UnitType, value: number) => {
    const fn = () => {
      setActive((draft) => {
        const d = dayjs(draft);
        return d.set(unit, d.get(unit) + value).toDate();
      });
    };
    fn();

    const loop = () => {
      fn();
      dataRef.current.clearLoop = async.setTimeout(() => loop(), 50);
    };
    dataRef.current.clearTid = async.setTimeout(() => loop(), 400);
  };

  const handleMouseUp = () => {
    dataRef.current.clearLoop?.();
    dataRef.current.clearTid?.();
  };

  useEvent(windowRef, 'mouseup', handleMouseUp);

  useImperativeHandle(ref, () => setActive, []);

  const buttonProps = (unit: UnitType, value: number) =>
    ({
      onMouseDown: (e) => {
        if (e.button === 0) {
          handleMouseDown(unit, value);
        }
      },
      onTouchStart: () => {
        handleMouseDown(unit, value);
      },
      onTouchEnd: () => {
        handleMouseUp();
      },
    }) as React.ButtonHTMLAttributes<HTMLButtonElement>;

  const weekList: Date[][] = (() => {
    const firstDay = active.set('date', 1);
    const month = [];
    let week = [];
    for (let num = 0, addDay = -firstDay.day(); num < 7 * 6; num++, addDay++) {
      week.push(firstDay.add(addDay, 'day').toDate());
      if (week.length === 7) {
        month.push(week);
        week = [];
      }
    }
    return month;
  })();

  return (
    <div {...styled('date-picker__panel')}>
      <div {...styled('date-picker__header')}>
        <button {...styled('date-picker__header-button')} {...buttonProps('year', -1)} title={t('DatePicker', 'Previous year')}>
          <Icon>
            <KeyboardDoubleArrowLeftOutlined />
          </Icon>
        </button>
        <button {...styled('date-picker__header-button')} {...buttonProps('month', -1)} title={t('DatePicker', 'Previous month')}>
          <Icon>
            <KeyboardArrowLeftOutlined />
          </Icon>
        </button>
        <span {...styled('date-picker__header-date')}>{active.format(lang === 'zh-CN' ? 'YYYY年 M月' : 'MMM YYYY')}</span>
        <button {...styled('date-picker__header-button')} {...buttonProps('month', 1)} title={t('DatePicker', 'Next month')}>
          <Icon>
            <KeyboardArrowRightOutlined />
          </Icon>
        </button>
        <button {...styled('date-picker__header-button')} {...buttonProps('year', 1)} title={t('DatePicker', 'Next year')}>
          <Icon>
            <KeyboardDoubleArrowRightOutlined />
          </Icon>
        </button>
      </div>
      <table {...styled('date-picker__table')}>
        <thead>
          <tr>
            {dayjs.weekdaysMin().map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weekList.map((week, index1) => (
            <tr key={index1}>
              {week.map((date, index2) => {
                const day = dayjs(date);
                const { disabled = false } = config?.(date) ?? {};
                const isCurrentSelected = currentSelectedProp && day.isSame(currentSelected, 'date');
                const isAnotherSelected = anotherSelected && day.isSame(anotherSelected, 'date');
                const isHover = !isCurrentSelected && !isAnotherSelected && anotherSelected && day.isSame(hover, 'date');
                const isBetween =
                  !isCurrentSelected &&
                  !isCurrentSelected &&
                  !isHover &&
                  currentSelectedProp &&
                  anotherSelected &&
                  day.isBetween(currentSelected, anotherSelected, 'date');
                const isBetweenHover = !isCurrentSelected && hover && anotherSelected && day.isBetween(hover, anotherSelected, 'date');

                return (
                  <td
                    key={index2}
                    style={{ pointerEvents: disabled ? 'none' : undefined }}
                    onClick={() => {
                      setActive(date);
                      onDateChange(currentSelected.set('year', day.year()).set('month', day.month()).set('date', day.date()).toDate());
                    }}
                    onMouseEnter={() => {
                      dataRef.current.clearHoverTid?.();
                      setHover(date);
                    }}
                    onMouseLeave={() => {
                      dataRef.current.clearHoverTid?.();
                      dataRef.current.clearHoverTid = async.setTimeout(() => setHover(null), 50);
                    }}
                  >
                    <div
                      {...styled('date-picker__cell', {
                        'date-picker__cell.is-active': range ? isAnotherSelected : isCurrentSelected,
                        'date-picker__cell.is-hover': isHover || (range && isCurrentSelected),
                        'date-picker__cell.is-between': isBetween,
                        'date-picker__cell.is-between-hover': isBetweenHover,
                        'date-picker__cell.is-disabled': disabled,
                        'date-picker__cell--out-month': day.get('month') !== active.get('month'),
                        'date-picker__cell--today': !isCurrentSelected && !isAnotherSelected && day.isSame(dayjs(), 'date'),
                      })}
                    >
                      {day.get('date')}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
