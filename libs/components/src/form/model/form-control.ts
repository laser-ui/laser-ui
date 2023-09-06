import type { AsyncValidatorFn, FormControlStatus, ValidatorFn } from './types';

import { AbstractControl } from './abstract-control';
import { VALID } from './vars';

export interface FormControlState<V> {
  value: V;
  disabled?: boolean;
}

export class FormControl<V> extends AbstractControl<V> {
  public readonly defaultState: FormControlState<V> | V;

  protected _value!: V;
  protected _status: FormControlStatus = VALID;

  constructor(
    formState: FormControlState<V> | V,
    validators?: ValidatorFn | ValidatorFn[] | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(validators ?? null, asyncValidator ?? null);
    this.defaultState = formState;
    this._applyFormState(formState);
    this.updateValueAndValidity(true);
  }

  getError(errorCode: string): any {
    return this && this.errors ? this.errors[errorCode] : null;
  }

  hasError(errorCode: string): boolean {
    return !!this.getError(errorCode);
  }

  override setValue(value: V, onlySelf?: boolean): void {
    this._value = value;
    this.updateValueAndValidity(onlySelf);
  }
  override patchValue(value: V, onlySelf?: boolean): void {
    this.setValue(value, onlySelf);
  }
  override reset(formState: V | FormControlState<V> = this.defaultState, onlySelf?: boolean): void {
    this._applyFormState(formState);
    this.markAsPristine(onlySelf);
    this.setValue(this.value, onlySelf);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected override _updateValue() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected override _forEachChild(): void {}

  protected override _anyControls(): boolean {
    return false;
  }

  protected override _allControlsDisabled(): boolean {
    return this.disabled;
  }

  protected _isFormStateObject(formState: FormControlState<V> | V): formState is FormControlState<V> {
    return (
      typeof formState === 'object' &&
      formState !== null &&
      Object.keys(formState).length === 2 &&
      'value' in formState &&
      'disabled' in formState
    );
  }

  private _applyFormState(formState: FormControlState<V> | V) {
    if (this._isFormStateObject(formState)) {
      this._value = formState.value;
      formState.disabled ? this.disable(true) : this.enable(true);
    } else {
      this._value = formState;
    }
  }
}
