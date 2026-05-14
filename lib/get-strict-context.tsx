import * as React from 'react';

export function getStrictContext<T>(name: string): [
  React.FC<{ value: T; children: React.ReactNode }>,
  () => T,
] {
  const Context = React.createContext<T | undefined>(undefined);
  Context.displayName = name;

  const Provider: React.FC<{ value: T; children: React.ReactNode }> = ({
    value,
    children,
  }) => <Context value={value}>{children}</Context>;

  const useContext = (): T => {
    const ctx = React.useContext(Context);
    if (ctx === undefined) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }
    return ctx;
  };

  return [Provider, useContext];
}
