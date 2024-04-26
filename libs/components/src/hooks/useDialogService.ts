import type { DialogInstance } from '../dialog-service';

import { useImmer } from '@laser-ui/hooks';
import { useMemo } from 'react';

import { DialogService } from '../dialog-service';

export function useDialogService() {
  const [dialogs, setDialogs] = useImmer<DialogInstance<any>[]>([]);
  const service = useMemo(
    () =>
      new DialogService((dialogs) => {
        setDialogs(dialogs);
      }),
    [setDialogs],
  );

  return [service, dialogs] as const;
}
