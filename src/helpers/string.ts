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
