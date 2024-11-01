import type { FormControlProvider, FormErrors, FormItemProps } from './types';

import { useForceUpdate } from '@laser-ui/hooks';
import CancelFilled from '@material-design-icons/svg/filled/cancel.svg?react';
import CheckCircleFilled from '@material-design-icons/svg/filled/check_circle.svg?react';
import ErrorFilled from '@material-design-icons/svg/filled/error.svg?react';
import HelpOutlineOutlined from '@material-design-icons/svg/outlined/help_outline.svg?react';
import { isBoolean, isFunction, isNull, isNumber, isString, isUndefined } from 'lodash';
import { useContext, useEffect, useId, useRef } from 'react';

import { FormError } from './internal/FormError';
import { Validators } from './model/validators';
import { CLASSES, FormContext, FormGroupContext } from './vars';
import { useComponentProps, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { CircularProgress } from '../internal/circular-progress';
import { Tooltip } from '../tooltip';
import { mergeCS } from '../utils';

interface FormError {
  key: string;
  controlName: string;
  message: string;
  invalid: 'warning' | 'error';
  hidden?: true;
}

const ValidateState = {
  Empty: 0,
  Success: 1,
  Warning: 2,
  Error: 3,
  Pending: 4,
};

export function FormItem<T extends { [index: string]: FormErrors }>(props: FormItemProps<T>): JSX.Element | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    formControls,
    label,
    labelWidth: labelWidthProp,
    labelWrap: labelWrapProp,
    labelExtra: labelExtraProp,
    labelFor,
    required: requiredProp,

    ...restProps
  } = useComponentProps('FormItem', props);

  const styled = useStyled(CLASSES, { form: styleProvider?.form }, styleOverrides);

  const { t } = useTranslation();
  const forceUpdate = useForceUpdate();

  const formContext = useContext(FormContext);
  const formGroupContext = useContext(FormGroupContext);

  const divRef = useRef<HTMLDivElement>(null);

  const uniqueId = useId();
  const getErrorId = (controlName: string) => `${controlName}-error-${uniqueId}`;

  const labelWidth = labelWidthProp ?? formContext.labelWidth;
  const labelWrap = isUndefined(labelWidth) ? false : (labelWrapProp ?? formContext.labelWrap);

  const formControlProviders = (() => {
    const obj = {} as { [N in keyof T]: FormControlProvider };
    Object.keys(formControls ?? {}).forEach((controlName: keyof T) => {
      const formControl = formGroupContext.get(controlName as string);
      if (isNull(formControl)) {
        throw new Error(`Cant find '${controlName as string}', please check if name exists!`);
      }
      (formControl as any)._emitChange = () => {
        (formControl as any)._emitChange = true;
      };
      obj[controlName] = {
        control: formControl,
        invalid: false,
        inputAria: {
          'aria-invalid': formControl.enabled && formControl.dirty && formControl.invalid,
        },
      };
    });
    return obj;
  })();
  useEffect(() => {
    const clear: (() => void)[] = [];
    for (const { control } of Object.values(formControlProviders)) {
      if ((control as any)._emitChange === true) {
        forceUpdate();
      }
      (control as any)._emitChange = forceUpdate;
      clear.push(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        (control as any)._emitChange = () => {};
      });
    }
    return () => {
      for (const cb of clear) {
        cb();
      }
    };
  }, []);

  const required = (() => {
    if (isBoolean(requiredProp)) {
      return requiredProp;
    }
    for (const { control } of Object.values(formControlProviders)) {
      if (control.hasValidator(Validators.required)) {
        return true;
      }
    }
    return false;
  })();

  const errorsRef = useRef<FormError[]>([]);
  const validateState: number = (() => {
    const errors: FormError[] = [];
    let validateState: number = ValidateState.Empty;

    Object.entries(formControls ?? {}).forEach(([controlName, formErrors]) => {
      const { control } = formControlProviders[controlName];
      let isPending = false;
      if (control.enabled && control.dirty) {
        switch (control.status) {
          case 'PENDING': {
            isPending = true;
            validateState = ValidateState.Pending;
            break;
          }

          case 'INVALID': {
            formControlProviders[controlName].invalid = 'warning';
            if (validateState < ValidateState.Warning) {
              validateState = ValidateState.Warning;
            }
            break;
          }

          case 'VALID': {
            if (validateState < ValidateState.Success) {
              validateState = ValidateState.Success;
            }
            break;
          }

          default:
            break;
        }

        let hasError = false;
        if (control.invalid && control.errors) {
          if (isString(formErrors)) {
            errors.push({ key: controlName, controlName, message: formErrors, invalid: 'error' });
            hasError = true;
          } else if (Object.keys(formErrors).length === 2 && 'message' in formErrors && 'invalid' in formErrors) {
            errors.push({
              key: controlName,
              controlName,
              ...(formErrors as { message: string; invalid: 'warning' | 'error' }),
            });
            if (formErrors.invalid === 'error') {
              hasError = true;
            }
          } else if (control.errors) {
            for (const key of Object.keys(control.errors)) {
              if (key in formErrors) {
                if (isString((formErrors as any)[key])) {
                  errors.push({ key: `${controlName}-${key}`, controlName, message: (formErrors as any)[key], invalid: 'error' });
                  hasError = true;
                } else {
                  errors.push({ key: `${controlName}-${key}`, controlName, ...(formErrors as any)[key] });
                  if ((formErrors as any)[key].invalid === 'error') {
                    hasError = true;
                  }
                }
              }
            }
          }
        }
        if (hasError) {
          if (!isPending) {
            formControlProviders[controlName].invalid = 'error';
          }
          if (validateState !== ValidateState.Pending) {
            validateState = ValidateState.Error;
          }
        }
      }
    });

    const newErrors: FormError[] = [];
    errorsRef.current.forEach((err) => {
      const index = errors.findIndex((e) => e.key === err.key);
      newErrors.push(Object.assign(err, { hidden: index === -1 }));
      if (index !== -1) {
        errors.splice(index, 1);
      }
    });
    errorsRef.current = newErrors.concat(errors);

    return validateState;
  })();

  const labelExtra = (() => {
    if (labelExtraProp) {
      return isString(labelExtraProp) ? (
        <Tooltip title={labelExtraProp}>
          <Icon>
            <HelpOutlineOutlined />
          </Icon>
        </Tooltip>
      ) : (
        <Tooltip title={labelExtraProp.title}>
          {labelExtraProp.icon ?? (
            <Icon>
              <HelpOutlineOutlined />
            </Icon>
          )}
        </Tooltip>
      );
    }
  })();

  return (
    <div
      {...restProps}
      {...mergeCS(styled('form__item'), {
        className: restProps.className,
        style: restProps.style,
      })}
      ref={divRef}
    >
      <div {...styled('form__item-container')}>
        {labelWidth !== 0 && (
          <div
            {...mergeCS(styled('form__item-label-wrapper'), {
              style: { width: formContext.vertical ? undefined : labelWidth === 'auto' ? 'var(--label-width)' : labelWidth },
            })}
          >
            {label && (
              <label
                {...styled('form__item-label', {
                  'form__item-label--wrap': labelWrap,
                  'form__item-label--required': formContext.requiredType === 'required' && required,
                  'form__item-label--colon': formContext.labelColon,
                })}
                htmlFor={labelFor}
                data-l-form-label
              >
                {label}
                {(labelExtra || (formContext.requiredType === 'optional' && !required)) && (
                  <div {...styled('form__item-label-extra')}>
                    {formContext.requiredType === 'optional' && !required && <span>{t('Form', 'Optional')}</span>}
                    {labelExtra}
                  </div>
                )}
              </label>
            )}
          </div>
        )}
        <div
          {...mergeCS(styled('form__item-content'), {
            style: {
              width: `calc(100% - ${
                formContext.vertical
                  ? '0px'
                  : labelWidth === 'auto'
                    ? 'var(--label-width)'
                    : labelWidth + (isNumber(labelWidth) ? 'px' : '')
              } - ${formContext.feedbackIcon ? 'var(--size)' : '0px'})`,
            },
          })}
        >
          <div {...styled('form__item-control')}>{isFunction(children) ? children(formControlProviders) : children}</div>
          <div {...styled('form__error-container')}>
            {(() => {
              const errorsMap = new Map<string, FormError[]>();
              errorsRef.current.forEach((err) => {
                if (errorsMap.has(err.controlName)) {
                  (errorsMap.get(err.controlName) as FormError[]).push(err);
                } else {
                  errorsMap.set(err.controlName, [err]);
                }
              });
              const nodes: JSX.Element[] = [];
              for (const [controlName, errors] of errorsMap) {
                const id = getErrorId(controlName);
                formControlProviders[controlName].inputAria['aria-describedby'] = id;

                nodes.push(
                  <div key={controlName} id={id}>
                    {errors.map((error) => (
                      <FormError
                        key={error.key}
                        styled={styled}
                        visible={!error.hidden}
                        message={error.message}
                        invalid={error.invalid}
                        afterLeave={() => {
                          errorsRef.current = errorsRef.current.filter((err) => err.key !== error.key);
                        }}
                      />
                    ))}
                  </div>,
                );
              }

              return nodes;
            })()}
          </div>
        </div>
        {formContext.feedbackIcon && (
          <div {...styled('form__item-feedback-icon')}>
            {(() => {
              if (validateState === ValidateState.Empty) {
                return null;
              } else {
                const icon = (state: number) =>
                  state === ValidateState.Pending ? (
                    <Icon theme="primary">
                      <CircularProgress />
                    </Icon>
                  ) : state === ValidateState.Error ? (
                    <Icon theme="danger">
                      <CancelFilled />
                    </Icon>
                  ) : state === ValidateState.Warning ? (
                    <Icon theme="warning">
                      <ErrorFilled />
                    </Icon>
                  ) : (
                    <Icon theme="success">
                      <CheckCircleFilled />
                    </Icon>
                  );

                if (isBoolean(formContext.feedbackIcon)) {
                  return icon(validateState);
                } else {
                  return (
                    formContext.feedbackIcon[
                      validateState === ValidateState.Pending
                        ? 'pending'
                        : validateState === ValidateState.Error
                          ? 'error'
                          : validateState === ValidateState.Warning
                            ? 'warning'
                            : 'success'
                    ] ?? icon(validateState)
                  );
                }
              }
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
