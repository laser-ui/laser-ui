import type { FormControlProvider } from '../form/types';

export function useDesign(opts: { compose?: { active?: boolean; disabled?: boolean }; form?: FormControlProvider }) {
  return {
    'data-l-compose-active': opts.compose?.active,
    'data-l-compose-disabled': opts.compose?.disabled,
    'data-l-form-invalid': opts.form?.invalid,
  };
}
