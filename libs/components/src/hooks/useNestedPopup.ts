import type { DraftFunction } from '@laser-ui/hooks/useImmer';

import { useForceUpdate } from '@laser-ui/hooks';
import { freeze, produce } from 'immer';
import { isFunction } from 'lodash';
import { useRef } from 'react';

interface PopupId<ID> {
  id: ID;
  visible: boolean;
}

export function useNestedPopup<ID>() {
  const forceUpdate = useForceUpdate();

  const popupIdsRef = useRef<PopupId<ID>[]>([]);

  const setPopupIds = (value: PopupId<ID>[] | DraftFunction<PopupId<ID>[]>) => {
    popupIdsRef.current = isFunction(value) ? produce(popupIdsRef.current, value) : freeze(value);
    forceUpdate();
  };

  return {
    popupIdsRef,
    setPopupIds,
    addPopupId: (id: ID) => {
      setPopupIds((draft) => {
        if (draft.findIndex((v) => v.id === id) === -1) {
          draft.push({ id, visible: true });
        }
      });
    },
    removePopupId: (id: ID) => {
      setPopupIds((draft) => {
        const index = draft.findIndex((v) => v.id === id);
        if (index !== -1) {
          draft[index].visible = false;
          for (let index = draft.length - 1; index >= 0; index--) {
            if (draft[index].visible) {
              break;
            }
            draft.pop();
          }
        }
      });
    },
  };
}
