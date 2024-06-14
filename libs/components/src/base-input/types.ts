export {};

export interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange: (val: string) => void;
}
