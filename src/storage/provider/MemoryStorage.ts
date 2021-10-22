/* eslint class-methods-use-this: off */

let ls: Record<string, any> = {};

class MemoryStorageInterface implements Storage {
  get length(): number {
    return Object.keys(ls).length;
  }

  constructor() {
    Object.defineProperty(this, 'length', {
      /**
       * Define length property
       *
       * @return {number}
       */
      get() {
        return Object.keys(ls).length;
      },
    });
  }

  /**
   * Get item
   *
   * @param {string} name
   * @returns {*}
   */
  getItem(name: string) {
    // eslint-disable-next-line no-restricted-syntax
    return name in ls ? ls[name] : null;
  }

  /**
   * Set item
   *
   * @param {string} name
   * @param {*} value
   * @returns {boolean}
   */
  setItem(name: string, value: any) {
    ls[name] = value;

    return true;
  }

  /**
   * Remove item
   *
   * @param {string} name
   * @returns {boolean}
   */
  removeItem(name: string) {
    // eslint-disable-next-line no-restricted-syntax
    const found = name in ls;

    if (found) {
      return delete ls[name];
    }

    return false;
  }

  /**
   * Clear storage
   *
   * @returns {boolean}
   */
  clear() {
    ls = {};

    return true;
  }

  /**
   * Get item by key
   *
   * @param {number} index
   * @returns {*}
   */
  key(index: number) {
    const keys = Object.keys(ls);

    return typeof keys[index] !== 'undefined' ? keys[index] : null;
  }
}

const MemoryStorage = new MemoryStorageInterface();

export { MemoryStorage };
