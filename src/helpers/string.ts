/**
 * 计算字符串占用 UTF8 字节长度
 *
 * @returns {number} output value
 * @param str
 */
export function strByteLength(str: string) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * 获取字符串长度，英文字符 长度1，中文字符长度2
 * @param {*} str
 */
export function getStrFullLength(str = '') {
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1;
    }
    return pre + 2;
  }, 0);
}

/**
 * 为手机号加 *
 * @param val
 */
export function maskMobile(val: string) {
  return val ? `${val.slice(0, 3)}****${val.slice(-4)}` : '';
}

/**
 * 截取字符串，根据 maxLength 截取后返回
 * @param {*} str
 * @param {*} maxLength
 */
export function cutStrByFullLength(str = '', maxLength: number) {
  let showLength = 0;
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1;
    } else {
      showLength += 2;
    }
    if (showLength <= maxLength) {
      return pre + cur;
    }
    return pre;
  }, '');
}

/**
 * 剔除字符串中的 Supplementary Multilingual Plane(SMP) 字符
 *
 * ex: 可以用于删除 mysql utf8_general_ci 不支持的所有字符。
 * SMP 字符包含 emoji 字符在内的很多字符
 * @url: https://en.wikipedia.org/wiki/Plane_(Unicode)#SMP
 */
export function noSMPChars(str: string) {
  return str.replace(/[\u{10000}-\u{1FBFF}]/gu, '');
}
