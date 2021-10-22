/* eslint prefer-const: 0 */

// 防抖
export function debounce(fn: Function, timeout = 1000) {
  let timer: number;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, timeout);
  };
}

// 节流
export function throttle(fn: Function, timeout = 1000) {
  let canRun = true;
  return (...args: any[]) => {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      fn(...args);
      canRun = true;
    }, timeout);
  };
}
