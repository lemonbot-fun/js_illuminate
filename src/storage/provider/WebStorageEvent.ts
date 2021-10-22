import { StorageListener } from '../index';

const listeners: Record<string, StorageListener[]> = {};

/**
 * Event class
 */
export class WebStorageEvent {
  /**
   * Add storage change event
   *
   * @param {string} name
   * @param {Function} callback
   */
  static on(name: string, callback: StorageListener) {
    if (typeof listeners[name] === 'undefined') {
      listeners[name] = [];
    }

    listeners[name].push(callback);
  }

  /**
   * Remove storage change event
   *
   * @param {string} name
   * @param {Function} callback
   */
  static off(name: string, callback: StorageListener) {
    if (listeners[name].length) {
      listeners[name].splice(listeners[name].indexOf(callback), 1);
    } else {
      listeners[name] = [];
    }
  }

  /**
   * Emit event
   *
   * @param {Object} event
   */
  static emit(event: any) {
    const e = event || window.event;

    const getValue = (data: string) => {
      try {
        return JSON.parse(data).value;
      } catch (err) {
        return data;
      }
    };

    const fire = (listener: StorageListener) => {
      const newValue = getValue(e.newValue);
      const oldValue = getValue(e.oldValue);

      listener(newValue, oldValue, e.url || e.uri);
    };

    if (typeof e === 'undefined' || typeof e.key === 'undefined') {
      return;
    }

    const all = listeners[e.key];

    if (typeof all !== 'undefined') {
      all.forEach(fire);
    }
  }
}
