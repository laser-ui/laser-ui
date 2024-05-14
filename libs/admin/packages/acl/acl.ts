import { isArray } from 'lodash';

export type Control = string | number;
export type ControlMode = 'one' | 'all';

export class ACL {
  private _full = false;
  private _controls = new Set<Control>();
  private _emitChange: () => void;

  public get full(): boolean {
    return this._full;
  }

  public get controls(): Control[] {
    return Array.from(this._controls);
  }

  constructor(emitChange: () => void) {
    this._emitChange = emitChange;
  }

  public setFull(full: boolean) {
    this._full = full;
    this._emitChange();
  }

  public set(control: Control[]): void {
    this._controls = new Set(control);
    this._emitChange();
  }

  public add(control: Control | Control[]): void {
    for (const v of isArray(control) ? control : [control]) {
      this._controls.add(v);
    }
    this._emitChange();
  }

  public remove(control: Control | Control[]): void {
    for (const v of isArray(control) ? control : [control]) {
      this._controls.delete(v);
    }
    this._emitChange();
  }

  public can(control: Control | Control[], mode: ControlMode = 'one'): boolean {
    if (this._full) {
      return true;
    }

    const controls = isArray(control) ? control : [control];
    if (mode === 'one') {
      return controls.some((v) => this._controls.has(v));
    } else {
      return controls.every((v) => this._controls.has(v));
    }
  }
}
