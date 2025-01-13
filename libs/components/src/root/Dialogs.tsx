import type { DialogInstance } from '../dialog-service';

import { memo } from 'react';

export const Dialogs = memo(function (props: { dialogs: DialogInstance<any>[] }) {
  return props.dialogs.map((dialog) => dialog.node);
});
