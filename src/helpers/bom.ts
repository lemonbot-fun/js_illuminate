export function isIE() {
  const bw = window.navigator.userAgent;
  const compare = (s: string) => bw.indexOf(s) >= 0;
  // eslint-disable-next-line no-restricted-syntax
  const ie11 = (() => 'ActiveXObject' in window)();
  return compare('MSIE') || ie11;
}

/**
 * 严格判定断线状态
 */
export function sureOffline() {
  // eslint-disable-next-line no-restricted-syntax
  return 'onLine' in navigator && !navigator.onLine;
}

export function openInNewWindow(url: string) {
  window.open(url);
}
