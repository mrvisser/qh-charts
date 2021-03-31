import React from 'react';

export function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mm = window.matchMedia(query);
    const listener = (ev: MediaQueryListEventMap['change']) =>
      setMatches(ev.matches);
    mm.addEventListener('change', listener);
    return () => mm.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
