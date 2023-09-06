import type { SelectItem } from '../../select/types';
import type { AbstractTreeNode } from '../../tree/node/abstract-node';
import type { TreeNode } from '../../tree/node/types';
import type { TREE_NODE_KEY } from '../../tree/vars';

export type CascaderSearchPanelItem<V extends React.Key, T extends TreeNode> = SelectItem<V> & { [TREE_NODE_KEY]: AbstractTreeNode<V, T> };
