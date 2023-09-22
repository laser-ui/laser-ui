import type { AssetGlob } from '@nx/js/src/utils/assets/assets';

export interface CssExecutorSchema {
  main: string;
  outputPath: string;
  assets: (AssetGlob | string)[];
  clean: boolean;
}
