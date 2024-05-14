import { isNull } from 'lodash';

import { Token } from './abstract-token';
import { base64url } from './base64url';

export interface JWTTokenPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
}
export class JWTToken<T extends JWTTokenPayload> extends Token {
  public get payload(): T | null {
    if (isNull(this.value)) {
      return null;
    }
    const [, payload] = this.value.split('.');
    return JSON.parse(base64url.decode(payload));
  }
  public get expiration(): number | null {
    return isNull(this.payload) ? null : this.payload.exp * 1000;
  }
  public set expiration(val: number | null) {
    throw new Error('You should not change `expiration` when use JWT!');
  }
}
