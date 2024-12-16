export {};

export interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
  onValueChange: (val: string) => void;
}
