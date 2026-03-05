import { useEffect, useState } from 'react';
import { getItem, setItem } from '@/services/storage';

type PersistentOptions<T> = {
  hydrate?: (stored: T, initial: T) => T;
};

export function usePersistentState<T>(
  storageKey: string,
  initialValue: T,
  options?: PersistentOptions<T>,
) {
  const [state, setState] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await getItem<T>(storageKey);

      if (stored !== undefined) {
        setState(options?.hydrate ? options.hydrate(stored, initialValue) : stored);
      }

      setReady(true);
    })();
  }, [storageKey]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    setItem(storageKey, state);
  }, [ready, state, storageKey]);

  return { state, setState, ready } as const;
}
