export {};

export interface TreeNode {
  disabled?: boolean;
  children?: TreeNode[];
}

export type TreeNodeStatus = 'INDETERMINATE' | 'CHECKED' | 'UNCHECKED';
