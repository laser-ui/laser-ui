import type { AbstractTreeNode } from './node/abstract-node';
import type { TreeNode } from './node/types';

export function getTreeNodeLabel<V extends React.Key, T extends TreeNode & { label: string }>(node: AbstractTreeNode<V, T>) {
  const text = [node.origin.label];
  let n = node;
  while (n.parent) {
    n = n.parent;
    text.unshift(n.origin.label);
  }
  return text.join(' / ');
}
