import type { MultipleExecutorSchema } from './schema';
import type { ExecutorContext } from '@nx/devkit';

import { runExecutor as run } from '@nx/devkit';
import { Subject } from 'rxjs';
import { eachValueFrom } from 'rxjs-for-await';

export default async function* runExecutor(options: MultipleExecutorSchema, context: ExecutorContext) {
  const subject = new Subject<{ success: boolean }>();

  for (const task of options.tasks) {
    const iterator = await run(task.targetDescription, task.options ?? {}, context);
    (async function () {
      for await (const res of iterator) {
        subject.next(res);
      }
    })();
  }

  return yield* eachValueFrom(subject);
}
