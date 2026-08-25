import { useEffect, useState } from 'react';

type Route = { name: string; params?: Record<string, string> };

let current: Route = { name: 'home' };
let listeners = new Set<(route: Route) => void>();

export function navigate(name: string, params?: Record<string, string>) {
  current = { name, params };
  listeners.forEach((listener) => listener(current));
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(current);
  useEffect(() => {
    listeners.add(setRoute);
    return () => { listeners.delete(setRoute); };
  }, []);
  return route;
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    listeners = new Set();
  });
}
