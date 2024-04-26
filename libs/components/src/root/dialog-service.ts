import { Store } from './vars';
import { DialogService as InternalDialogService } from '../dialog-service';

export const DialogService = new InternalDialogService((dialogs) => {
  Store.set('dialogs', dialogs);
});
