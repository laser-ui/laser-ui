import type { TreeNode, TreeNodeStatus } from './types';

import { CHECKED, INDETERMINATE, UNCHECKED } from './vars';

export abstract class AbstractTreeNode<ID extends React.Key, T extends TreeNode> {
  private _parent: AbstractTreeNode<ID, T> | null = null;

  constructor(public origin: T) {}

  get parent(): AbstractTreeNode<ID, T> | null {
    return this._parent;
  }
  get root(): AbstractTreeNode<ID, T> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node: AbstractTreeNode<ID, T> = this;

    while (node.parent) {
      node = node.parent;
    }

    return node;
  }

  get isLeaf(): boolean {
    return !this.children;
  }

  get id(): ID {
    return this._id;
  }

  get status(): TreeNodeStatus {
    return this._status;
  }

  get checked(): boolean {
    return this._status === CHECKED;
  }
  get unchecked(): boolean {
    return this._status === UNCHECKED;
  }
  get indeterminate(): boolean {
    return this._status === INDETERMINATE;
  }

  get disabled(): boolean {
    return this._disabled;
  }
  get enabled(): boolean {
    return !this._disabled;
  }

  updateStatus(checked: ID | null | Set<ID>, onlySelf = false): void {
    if (this.children && !onlySelf) {
      this.children.forEach((child) => {
        child.updateStatus(checked, onlySelf);
      });
    }

    this._calculateStatus(checked);
  }

  protected _setParent(parent: AbstractTreeNode<ID, T>): void {
    this._parent = parent;
  }

  protected _updateAncestors(checked: ID | null | Set<ID>, onlySelf: boolean) {
    if (this._parent && !onlySelf) {
      this._parent.updateStatus(checked, onlySelf);
    }
  }

  abstract children?: AbstractTreeNode<ID, T>[];

  protected abstract _id: ID;

  protected abstract _status: TreeNodeStatus;
  protected abstract _disabled: boolean;

  protected abstract _calculateStatus(checked: ID | null | Set<ID>): void;
}
