export {};

export type WaveRef = () => void;

export interface WaveProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  color: string;
}
