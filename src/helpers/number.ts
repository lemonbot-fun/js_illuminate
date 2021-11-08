/**
 * 将数据转化为 数值/0
 *
 * @param origin
 */
export function parseNumberOrZero(origin: any) {
  if (typeof origin === 'number') {
    return origin;
  }

  // eslint-disable-next-line no-void
  if (origin === void 0 || origin === null) {
    return 0;
  }

  let val;
  if (origin.toString().indexOf('.') !== -1) {
    val = parseFloat(origin);
  } else {
    val = parseInt(origin, 10);
  }

  if (Number.isNaN(val)) {
    return 0;
  }
  return val;
}

/**
 * 将整数部分逢三一断
 *
 * @param val
 */
export function numberFormat(val: string) {
  if (!val) {
    return '0';
  }

  // 将整数部分逢三一断
  return val.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

/**
 * 科学计数法转正常数字
 *
 * @param num
 */
export function toNonExponential(num: number) {
  const match = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  if (!match) return '';
  return num.toFixed(Math.max(0, (match[1] || '').length - +match[2]));
}

/**
 * 范围匹配
 *
 * @param num
 * @param min
 * @param max
 */
export function between(num: number, min: number, max: number) {
  return min <= num && num <= max;
}

/**
 * 格式化人民币价格
 *
 * @param val
 * @param isForced
 * @param num
 */
export function formatCny(val: string, isForced = true) {
  let res = parseNumberOrZero(val).toFixed(2);

  if (!isForced) {
    res = res.replace(/0+$/, '').replace(/\.+$/, '');
  }

  return res;
}

/**
 * 保留特定位数的小数并做千分位格式化
 *
 * @param number
 * @param minimumFractionDigits
 * @param maximumFractionDigits
 */
export function formatWithIntl(number: number, minimumFractionDigits = 2, maximumFractionDigits = 2) {
  // eslint-disable-next-line no-param-reassign
  maximumFractionDigits = Math.max(minimumFractionDigits, maximumFractionDigits);

  return new Intl.NumberFormat('en-us', {
    maximumFractionDigits: maximumFractionDigits || 2,
    minimumFractionDigits: minimumFractionDigits || 2,
  }).format(number);
}
