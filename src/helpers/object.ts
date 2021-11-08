import lOmit from 'lodash/omit';
import { is } from './type';

/**
 * 当 val 值为 null 的时候返回 def
 * @param val
 * @param def
 */
export function nullThen(val: any, def: any) {
  return val === null ? def : val;
}

/**
 * 判断一个数据是否为空值 ex: null,undifined,"",[]
 * @param val
 */
export function isEmpty(val: any) {
  // eslint-disable-next-line no-void
  return val === null || val === void 0 || val === '' || (Array.isArray(val) && val.length === 0);
}

/**
 * 判断一个数据是否为空值 ex: null,undifined,"",[]
 *
 * @param val
 * @param def
 */
export function emptyThen<T>(val: any, def: T): T {
  return isEmpty(val) ? val : def;
}

/**
 * 取出对象中不为空的数据组成新的对象
 *
 * @param origin
 */
export function noEmptyProp<T extends Record<string | number | symbol, any>>(origin: T): Partial<T> {
  const data: Partial<T> = {};
  Object.entries(origin).forEach(([key, val]) => {
    // eslint-disable-next-line no-void
    if (isEmpty(val)) return;
    data[key as keyof T] = val;
  });

  return data;
}

/**
 * 取出对象中不包含特定 key 的元素组成新对象
 *
 * @param origin
 * @param keys
 */
export const not = lOmit;
export const omit = lOmit;

/**
 * 附加数据到对象/reactive. 同时判断子值是否为空 如果为空, 则启用默认数据。
 *
 * @param to
 * @param data
 * @param def
 */
export function assignWithDefault<T>(to: T, data: any, def: T): T {
  return Object.assign(to, def, noEmptyProp(data));
}

/**
 * 静态克隆
 *
 * @param obj
 */
export function staticClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 判断是否为 thenAble
 *
 * @param obj
 */
export function isThenAble(obj: any) {
  return is.object(obj) && is.function(obj.then);
}
