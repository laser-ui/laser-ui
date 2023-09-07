import { copyFileSync, copySync } from 'fs-extra';
import { join } from 'path';

copySync(join(__dirname, '../../libs/themes'), join(__dirname, '../../dist/libs/themes'));
copyFileSync(join(__dirname, '../../LICENSE'), join(__dirname, '../../dist/libs/themes/LICENSE'));
