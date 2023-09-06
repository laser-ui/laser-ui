export function mergeCS(
  target: { className: string; style: React.CSSProperties },
  source: { className?: string; style?: React.CSSProperties },
): { className: string; style: React.CSSProperties } {
  return {
    className: target.className + (source.className ? ` ${source.className}` : ''),
    style: Object.assign({}, target.style, source.style),
  };
}
