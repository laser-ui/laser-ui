export interface MultipleExecutorSchema {
  tasks: {
    targetDescription: {
      project: string;
      target: string;
      configuration?: string;
    };
    options?: {
      [index: string]: any;
    };
  }[];
}
