/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Observable } from 'rxjs/internal/Observable';

export type ObserverFunction<T> = () => Observable<T> | undefined;

/** @see [useObservable(observableGenerator, deps, initialvalue?)] */
export function useObservable<T>(
  observableGenerator: ObserverFunction<T>,
  deps: React.DependencyList,
): [T | undefined];

/** @see [useObservable(observableGenerator, deps, initialvalue?)] */
export function useObservable<T>(
  observableGenerator: ObserverFunction<T>,
  deps: React.DependencyList,
  initialValue: T,
): [T];

/**
 * A custom hook that exposes an observable as its latest emitted value.
 *
 * @param observableGenerator A factory function for the observable
 * @param deps The dependency array. When any of these dependencies changes, the observable will
 *   be regenerated.
 * @param initialValue The initial value of the observable value, before it emits its first value.
 *   When the dependency array changes, the value will not revert to the initial value.
 * @returns
 */
export function useObservable<T>(
  observableGenerator: ObserverFunction<T>,
  deps: React.DependencyList,
  initialValue?: T,
): [typeof initialValue] {
  const [value, setValue] =
    React.useState<T | typeof initialValue>(initialValue);
  const cb = React.useCallback(observableGenerator, deps);

  /** When the callback changes, reinvoke it and subscribe to the new observable. */
  React.useEffect(() => {
    const o = cb();
    if (o !== undefined) {
      // eslint-disable-next-line deprecation/deprecation
      const sub = o.subscribe({
        // eslint-disable-next-line no-console
        error: (err) => console.error(err),
        next: setValue,
      });
      return () => sub.unsubscribe();
    }
  }, [cb]);

  return [value];
}
