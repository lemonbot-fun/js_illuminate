import { WebStorageEvent } from './WebStorageEvent';
import { StorageListener, StorageOptions } from '../index';

/**
 * Storage Bridge
 */
export class WebStorage {
  storage: Storage;

  options: StorageOptions = {
    namespace: '',
    events: ['storage'],
  };

  length = 0;

  /**
   * @param {Object} storage
   */
  constructor(storage: Storage) {
    this.storage = storage;
    this.options = {
      namespace: '',
      events: ['storage'],
    };

    Object.defineProperty(this, 'length', {
      /**
       * Define length property
       *
       * @return {number}
       */
      get() {
        return this.storage.length;
      },
    });

    if (typeof window !== 'undefined') {
      this.options.events?.forEach(name => {
        window.addEventListener(name, WebStorageEvent.emit, false);
      });
    }
  }

  /**
   * Set Options
   *
   * @param {Object} options
   */
  setOptions(options = {}) {
    this.options = Object.assign(this.options, options);
  }

  /**
   * Set item
   *
   * @param {string} name
   * @param {*} value
   * @param {number} expire - seconds
   */
  set(name: string, value: any, expire?: number) {
    const stringifyValue = JSON.stringify({
      value,
      expire: expire !== undefined ? new Date().getTime() + expire : null,
    });

    this.storage.setItem(this.options.namespace + name, stringifyValue);
  }

  /**
   * Get item
   *
   * @param {string} name
   * @param {*} def - default value
   * @returns {*}
   */
  get(name: string, def: any = null) {
    const item = this.storage.getItem(this.options.namespace + name);

    if (item !== null) {
      try {
        const data = JSON.parse(item);

        if (data.expire === null) {
          return data.value;
        }

        if (data.expire >= new Date().getTime()) {
          return data.value;
        }

        this.remove(name);
      } catch (err) {
        return def;
      }
    }

    return def;
  }

  /**
   * Get item by key
   *
   * @param {number} index
   * @return {*}
   */
  key(index: number) {
    return this.storage.key(index);
  }

  /**
   * Remove item
   *
   * @param {string} name
   * @return {boolean}
   */
  remove(name: string) {
    return this.storage.removeItem(this.options.namespace + name);
  }

  /**
   * Clear storage
   */
  clear() {
    if (this.length === 0) {
      return;
    }

    const removedKeys: string[] = [];

    for (let i = 0; i < this.length; i++) {
      const key = this.storage.key(i)!;
      const regexp = new RegExp(`^${this.options.namespace}.+`, 'i');

      if (!regexp.test(key)) {
        continue;
      }

      removedKeys.push(key);
    }

    removedKeys.forEach(item => {
      this.storage.removeItem(item);
    });
  }

  /**
   * Add storage change event
   *
   * @param {string} name
   * @param {Function} callback
   */
  on(name: string, callback: StorageListener) {
    WebStorageEvent.on(this.options.namespace + name, callback);
  }

  /**
   * Remove storage change event
   *
   * @param {string} name
   * @param {Function} callback
   */
  off(name: string, callback: StorageListener) {
    WebStorageEvent.off(this.options.namespace + name, callback);
  }
}
