import { CLASSES } from './vars';
import { useStyled } from '../../hooks';
import { mergeCS } from '../../utils';

export function CircularProgress(props: React.SVGProps<SVGSVGElement>): JSX.Element | null {
  const styled = useStyled(CLASSES, { 'circular-progress': undefined });

  return (
    <svg
      {...props}
      {...mergeCS(styled('circular-progress'), {
        className: props.className,
        style: props.style,
      })}
      viewBox="22 22 44 44"
    >
      <circle {...styled('circular-progress__circle')} cx={44} cy={44} r={18.337} strokeWidth={3.6} fill="none" />
    </svg>
  );
}
