/* eslint-disable @typescript-eslint/no-empty-function */
import type { AbstractStorage } from '../storage/abstract-storage';

import { isNull } from 'lodash';

import { LocalStorageService } from '../storage/local-storage';

export interface TokenConfigs {
  storage: AbstractStorage<string, string>;
  key: string;
  expirationOffset: number;
  refreshOffset: number;
}

export abstract class Token {
  private _configs: TokenConfigs = {
    storage: new LocalStorageService(),
    key: 'token',
    expirationOffset: 10 * 1000,
    refreshOffset: 60 * 1000,
  };
  private _value: string | null = null;
  private _refresh: false | (() => Promise<string>) = false;
  private _cancelRefresh = () => {};

  public abstract get expiration(): number | null;
  public abstract set expiration(val: number | null);

  public get configs(): TokenConfigs {
    return this._configs;
  }

  public get value(): string | null {
    return this._value;
  }

  public set refresh(val: false | (() => Promise<string>)) {
    this._refresh = val;
  }

  public get expired(): boolean {
    if (isNull(this.expiration)) {
      return false;
    } else {
      return this.expiration - this._configs.expirationOffset <= Date.now();
    }
  }

  constructor(configs: Partial<TokenConfigs>) {
    this.config(configs);

    if (this._configs.refreshOffset <= this._configs.expirationOffset) {
      throw new Error('`refreshOffset` should be greater than `expirationOffset`');
    }

    this.updateToken(this._configs.storage.getItem(this._configs.key));
  }

  private updateToken(val: string | null) {
    if (val !== this._value) {
      this._value = val;

      this._cancelRefresh();
      if (val && !isNull(this.expiration) && !this.expired) {
        const timeout = this.expiration - Date.now() - this._configs.refreshOffset;
        new Promise<string>((resolve, reject) => {
          const tid = window.setTimeout(() => {
            if (this._refresh) {
              this._refresh().then(resolve);
            }
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

  config(configs: Partial<TokenConfigs>) {
    Object.keys(configs).forEach((key) => {
      (this._configs as any)[key] = (configs as any)[key];
    });
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
