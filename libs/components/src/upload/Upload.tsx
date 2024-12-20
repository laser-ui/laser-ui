import type { UploadFile, UploadProps } from './types';

import { useEventCallback, useUnmount } from '@laser-ui/hooks';
import { setRef } from '@laser-ui/utils';
import { isNumber } from 'lodash';
import { useMemo, useRef } from 'react';

import { UploadAction } from './UploadAction';
import { UploadButton } from './UploadButton';
import { UploadList } from './UploadList';
import { UploadPicture } from './UploadPicture';
import { UploadPictureList } from './UploadPictureList';
import { UploadPreviewAction } from './UploadPreviewAction';
import { CLASSES, UploadContext } from './vars';
import { useComponentProps, useControlled, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const Upload: {
  (props: UploadProps): React.ReactElement | null;
  Button: typeof UploadButton;
  Action: typeof UploadAction;
  PreviewAction: typeof UploadPreviewAction;
  List: typeof UploadList;
  Picture: typeof UploadPicture;
  PictureList: typeof UploadPictureList;
} = (props) => {
  const {
    ref,
    children,
    styleOverrides,
    styleProvider,
    formControl,
    model,
    defaultModel,
    request,
    max,
    drag = false,
    customUpload,
    beforeUpload,
    onModelChange,
    onRemove,

    ...restProps
  } = useComponentProps('Upload', props);

  const styled = useStyled(CLASSES, { upload: styleProvider?.upload, 'upload-list': styleProvider?.['upload-list'] }, styleOverrides);

  const inputRef = useRef<HTMLInputElement>(null);

  const fileURLs = useRef([] as string[]);

  const [files, changeFiles] = useControlled<UploadFile[]>(defaultModel ?? [], model, undefined, undefined, formControl?.control);

  useUnmount(() => {
    fileURLs.current.forEach((fileURL) => {
      URL.revokeObjectURL(fileURL);
    });
  });

  const handleFiles = (fileList: FileList) => {
    if (customUpload) {
      customUpload(fileList);
    } else {
      let n: React.Key = Date.now();
      const filesAdded: UploadFile[] = [];
      for (let index = 0; index < fileList.length; index++) {
        const file = fileList.item(index);
        if (file) {
          const xhr = new XMLHttpRequest();

          let uid: React.Key = ++n;
          const add = (obj: any) => {
            const fileURL = URL.createObjectURL(file);
            fileURLs.current.push(fileURL);
            const fileAdded = {
              uid,
              name: file.name,
              url: fileURL,
              thumbUrl: file.type.startsWith('image') ? fileURL : undefined,
              originFile: file,
              response: xhr.response,
              ...obj,
            };

            if (isNumber(max) && files.length + filesAdded.length >= max) {
              if (max === 1) {
                uid = fileAdded.uid = files[0].uid;
                changeFiles([fileAdded]);
                onModelChange?.([fileAdded], {
                  type: 'update',
                  files: [fileAdded],
                });
                return;
              }
              return true;
            }

            filesAdded.push(fileAdded);
          };
          const update = (obj: any) => {
            let hasChange = true;
            const list = changeFiles((draft) => {
              const index = draft.findIndex((f) => f.uid === uid);
              if (index !== -1) {
                draft[index] = Object.assign(draft[index], { response: xhr.response, ...obj });
              } else {
                hasChange = false;
              }
            });
            if (hasChange) {
              onModelChange?.(list, {
                type: 'update',
                files: [list.find((f) => f.uid === uid) as UploadFile],
              });
            }
          };

          const upload = (condition: boolean | string | Blob) => {
            if (condition === false) {
              add({ state: null });
            } else {
              const abort = add({ state: 'progress', percent: 0 });
              if (abort) {
                return;
              }

              xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                  const percent = Math.round((e.loaded * 100) / e.total);
                  update({ state: 'progress', percent });
                }
              });
              xhr.addEventListener('error', () => {
                update({ state: 'error', percent: undefined });
              });
              xhr.addEventListener('load', () => {
                update({ state: xhr.status >= 200 && xhr.status < 300 ? 'load' : 'error', percent: undefined });
              });

              const {
                url,
                method = 'POST',
                responseType = 'json',
                header = {},
                body = (file) => {
                  const formData = new FormData();
                  formData.append('file', file);
                  return formData;
                },
                custom,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              } = request!;

              xhr.open(method, url);
              xhr.responseType = responseType;
              Object.entries(header).forEach((h) => {
                xhr.setRequestHeader(...h);
              });
              custom?.(xhr);
              xhr.send(body(condition === true ? file : condition));
            }
          };

          let shouldUpload: boolean | string | Blob | Promise<boolean | string | Blob> = true;
          if (beforeUpload) {
            shouldUpload = beforeUpload(file, fileList);
            if (shouldUpload instanceof Promise) {
              shouldUpload.then((condition) => {
                upload(condition);
              });
            } else {
              upload(shouldUpload);
            }
          } else {
            upload(true);
          }
        }
      }

      if (filesAdded.length > 0) {
        const list = changeFiles((draft) => draft.concat(filesAdded));
        onModelChange?.(list, {
          type: 'add',
          files: filesAdded,
        });
      }
    }
  };

  const handleRemove = useEventCallback((file: UploadFile) => {
    onRemove?.(file);

    const newList = changeFiles((draft) => {
      const index = draft.findIndex((f) => f.uid === file.uid);
      draft.splice(index, 1);
    });
    onModelChange?.(newList, { type: 'remove', files: [file] });
  });
  const context = useMemo(() => ({ files, onRemove: handleRemove }), [files, handleRemove]);

  return (
    <>
      <UploadContext value={context}>
        {children({
          onClick: () => {
            if (inputRef.current) {
              inputRef.current.click();
            }
          },
          ...(drag
            ? {
                onDragEnter: (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                },
                onDragOver: (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                },
                onDrop: (e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  const dt = e.dataTransfer;
                  const files = dt.files;
                  handleFiles(files);
                },
              }
            : undefined),
        })}
      </UploadContext>
      <input
        {...restProps}
        {...mergeCS(styled('upload'), {
          className: restProps.className,
          style: restProps.style,
        })}
        ref={(instance) => {
          const ret = setRef(ref, instance);
          inputRef.current = instance;
          return () => {
            ret();
            inputRef.current = null;
          };
        }}
        type={restProps.type ?? 'file'}
        onChange={(e) => {
          restProps.onChange?.(e);

          const files = e.currentTarget.files;
          if (files) {
            handleFiles(files);
          }

          e.currentTarget.value = '';
        }}
      />
    </>
  );
};

Upload.Button = UploadButton;
Upload.Action = UploadAction;
Upload.PreviewAction = UploadPreviewAction;
Upload.List = UploadList;
Upload.Picture = UploadPicture;
Upload.PictureList = UploadPictureList;
