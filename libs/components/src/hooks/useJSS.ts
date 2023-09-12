import { create } from 'jss';
import preset from 'jss-preset-default';
import { useEffect, useMemo } from 'react';

const jss = create();
jss.setup(preset());

export function useJSS<T extends string | number | symbol>() {
  const sheet = useMemo(() => jss.createStyleSheet<T>({}), []);

  useEffect(() => {
    sheet.attach();

    return () => {
      sheet.detach();
    };
  }, [sheet]);

  return sheet;
}
