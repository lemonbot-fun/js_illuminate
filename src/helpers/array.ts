import { isEmpty } from './object';

/**
 * 从指定的位置开始先后依次插入数组元素
 *
 * @param origin
 * @param index
 * @param args
 */
export function insert(origin: any[], index: number, ...args: any[]) {
  origin.splice(index, 0, ...args);
  return origin;
}

/**
 * 统计树深度
 */
export function treeDeep(items: Record<string, any>[], childIndex = 'children', attachDeepData = false, deepIndex = 'depth') {
  let inc = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item[childIndex] || !item[childIndex].length) {
      // 将深度数据附加到元素上
      if (attachDeepData) item[deepIndex] = 0;
      continue;
    }
    const offspringLen = treeDeep(item[childIndex], childIndex, attachDeepData, deepIndex);

    // 将深度数据附加到元素上
    if (attachDeepData) item[deepIndex] = offspringLen;

    // 更新最大深度
    inc = offspringLen > inc ? offspringLen : inc;
  }

  return 1 + inc;
}

/**
 * 跨越多层 连续 执行
 *
 * @param arr
 * @param childrenKey
 * @param callback
 * @param accumulator
 */
export function deepReduce<T>(arr: any[], childrenKey: string, callback: (prev: T, curr: any, index: number, arr: any[]) => T, accumulator: T): T {
  return arr.reduce((prev, curr, index) => {
    prev = callback(prev, curr, index, arr);
    if (curr[childrenKey]) {
      prev = deepReduce(curr[childrenKey], childrenKey, callback, prev);
    }
    return prev;
  }, accumulator);
}

/**
 * 格式化树形数据
 *
 * @param tree
 * @param map
 * @param childrenKey
 */
export function settleTree(tree: any[], map: { [form: string]: string | ((item: any, index: number, prefix: any[]) => any) }, childrenKey = 'children', prefix: any[] = []) {
  tree.forEach((item, index) => {
    Object.entries(map)
      .forEach(([to, from]) => {
        if (typeof from === 'string' && isEmpty(item[from])) return;

        item[to] = typeof from === 'function' ? from(item, index, prefix) : item[from];
      });

    if (item[childrenKey]) {
      item.children = settleTree(item[childrenKey], map, childrenKey, [...prefix, item]);
    }
  });

  return tree;
}

export type TreeNode<T> = T & { children?: TreeNode<T>[] };

/**
 * 基于数组创建树形结构
 *
 * @param arr
 * @param idIndex
 * @param pidIndex
 */
export function buildTree<T extends Record<string, any> = any>(arr: Array<T>, idIndex = 'id', pidIndex = 'pid'): Array<TreeNode<T>> {
  const result = []; // 存放结果集
  const tmpMap: Record<string, TreeNode<T>> = {}; //
  for (const item of arr) {
    const id = item[idIndex];
    const pid = item[pidIndex];

    if (!tmpMap[id]) {
      tmpMap[id] = {
        children: [] as TreeNode<T>[],
      } as TreeNode<T>;
    }

    tmpMap[id] = {
      ...item,
      children: ([] as any[]).concat(item.children || [], tmpMap[id].children || []),
    };

    const treeItem = tmpMap[id];

    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!tmpMap[pid]) {
        tmpMap[pid] = {
          children: [] as TreeNode<T>[],
        } as TreeNode<T>;
      }

      tmpMap[pid].children!.push(treeItem);
    }
  }

  return result;
}
