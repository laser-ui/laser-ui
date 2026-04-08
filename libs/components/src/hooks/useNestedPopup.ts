import { useImmer } from '@laser-ui/hooks';

interface PopupId<ID> {
  id: ID;
  visible: boolean;
}

export function useNestedPopup<ID>(visible = true) {
  const [popupIds, setPopupIds] = useImmer<PopupId<ID>[]>([]);
  if (!visible && popupIds.length > 0) {
    setPopupIds([]);
  }

  return {
    popupIds,
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
