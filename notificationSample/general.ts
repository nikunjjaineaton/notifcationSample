export type Dictionary<T> = { [key: string]: T };
export type Fn<T, U> = (t: T) => U;
export type Minus<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UnionKeys<T> = T[keyof T];
export type TypeGuard<T> = (x: any) => x is T;
