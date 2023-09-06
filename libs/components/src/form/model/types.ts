import type { AbstractControl } from './abstract-control';

export {};

export type FormControlStatus = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';

export interface ValidationErrors {
  [key: string]: any;
}

export type ValidatorFn = (control: AbstractControl) => ValidationErrors | null;

export type AsyncValidatorFn = (control: AbstractControl) => Promise<ValidationErrors | null>;
