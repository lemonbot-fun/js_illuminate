/* eslint-disable no-restricted-syntax */

import { MemoryStorage, WebStorage } from './provider';

// eslint-disable-next-line
const _global: {
  localStorage?: Storage,
  sessionStorage?: Storage,
} = (typeof window !== 'undefined' ? window : {});

export type StorageListener = (newValue: any, oldValue: any, url: string) => void;

export type StorageOptions = {
  namespace?: string;
  events?: string[];
  storage?: 'local' | 'session' | 'memory';
};

const defaultStore = 'localStorage' in _global
  ? _global.localStorage!
  : 'sessionStorage' in _global
    ? _global.sessionStorage!
    : MemoryStorage;

const ls = new WebStorage(defaultStore);

ls.setOptions(Object.assign(ls.options, { namespace: '' }));

export function getStorage(userOptions: StorageOptions = {}): WebStorage {
  const options = {
    ...userOptions,
    storage: userOptions.storage || 'local',
    namespace: userOptions.namespace || 'ls',
  };

  if (options.storage && ['memory', 'local', 'session'].indexOf(options.storage) === -1) {
    throw new Error(`Storage "${options.storage}" is not supported`);
  }

  let store = null;

  switch (options.storage) { // eslint-disable-line
    case 'local':
      store = 'localStorage' in _global
        ? _global.localStorage
        : null;
      break;

    case 'session':
      store = 'sessionStorage' in _global
        ? _global.sessionStorage
        : null;
      break;
    case 'memory':
      store = MemoryStorage;
      break;
  }

  if (!store) {
    store = MemoryStorage;
    // eslint-disable-next-line
    console.error(`Storage "${options.storage}" is not supported your system, use memory storage`);
  }

  const ws = new WebStorage(store);

  ws.setOptions(Object.assign(ws.options, {
    namespace: '',
  }, options || {}));
  return ws;
}

export default ls;
