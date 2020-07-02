import { identity,noop } from 'lodash';
import { Fn } from '~src/types/general'

export class Maybe<T> {
  static of<T>(value: T | undefined): Maybe<T> {
    return new Maybe<T>(value);
  }

  static none<T>(): Maybe<T> {
    return new Maybe<T>(undefined);
  }

  private readonly value: T | undefined;

  constructor(value: T | undefined) {
    this.value = value;
  }

  map<U>(ifSome: (t: T) => U | undefined): Maybe<U> {
    if (this.value === undefined) {
      return Maybe.none();
    } else {
      return Maybe.of(ifSome(this.value));
    }
  }

  unwrap<U>(ifSome: (value: T) => U = identity): U | undefined {
    return this.value ? ifSome(this.value) : undefined;
  }

  or<U>(fn: () => U): T | U {
    if (this.value === undefined) {
      return fn();
    } else {
      return this.value;
    }
  }

  doAction(ifSome: Fn<T, void> = noop, ifNone: Fn<void, void> = noop) {
    if (this.value === undefined) {
      ifNone();
    } else {
      ifSome(this.value);
    }
  }

  orThrow(makeError: () => Error): T {
    if (this.value === undefined) {
      throw makeError();
    } else {
      return this.value;
    }
  }

  isSome() {
   
    if (this.value === undefined || this.value === null)
    {
        return false
    }else{
      return true
    }

  }
}

