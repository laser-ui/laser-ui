/* eslint-disable @typescript-eslint/no-empty-function */
import type { AbstractStorage } from '../storage/abstract-storage';

import { isNull } from 'lodash';

import { LocalStorageService } from '../storage/local-storage';

export interface Configs {
  storage: AbstractStorage<string, string>;
  key: string;
  expirationOffset: number;
  refresh: false | (() => Promise<string>);
  refreshOffset: number;
}

export abstract class Token {
  private _configs: Configs = {
    storage: new LocalStorageService(),
    key: 'token',
    expirationOffset: 10 * 1000,
    refresh: false,
    refreshOffset: 60 * 1000,
  };
  private _value: string | null = null;
  private _cancelRefresh = () => {};

  public abstract get expiration(): number | null;
  public abstract set expiration(val: number | null);

  public get value(): string | null {
    return this._value;
  }

  public get expired(): boolean {
    if (isNull(this.expiration)) {
      return false;
    } else {
      return this.expiration - this._configs.expirationOffset <= Date.now();
    }
  }

  constructor(configs: Partial<Configs>) {
    Object.keys(configs).forEach((key) => {
      (this._configs as any)[key] = (configs as any)[key];
    });

    if (this._configs.refresh) {
      if (this._configs.refreshOffset <= this._configs.expirationOffset) {
        throw new Error('`refreshOffset` should be greater than `expirationOffset`');
      }
    }

    this.updateToken(this._configs.storage.getItem(this._configs.key));
  }

  private updateToken(val: string | null) {
    if (val !== this._value) {
      this._value = val;

      this._cancelRefresh();
      const refreshToken = this._configs.refresh;
      if (refreshToken && val && !isNull(this.expiration) && !this.expired) {
        const timeout = this.expiration - Date.now() - this._configs.refreshOffset;
        new Promise<string>((resolve, reject) => {
          const tid = window.setTimeout(() => {
            refreshToken().then((token) => resolve(token));
          }, timeout);
          this._cancelRefresh = () => {
            clearTimeout(tid);
            reject();
          };
        })
          .then((token) => {
            this.updateToken(token);
          })
          .catch(() => {});
      }
    }
  }

  set(val: string) {
    this._configs.storage.setItem(this._configs.key, val);
    this.updateToken(val);
  }
  remove() {
    this._configs.storage.removeItem(this._configs.key);
    this.updateToken(null);
  }
}
