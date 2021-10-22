import { cloneDeep } from 'lodash';
import { buildTree, deepReduce, insert, settleTree, treeDeep } from '@/helpers/array';

test('insert() 测试', () => {
  const origin = insert(
    [
      { id: 1, name: 'Item1' },
      { id: 3, name: 'Item3' },
    ],
    1,
    { id: 2, name: 'Item2' },
    { id: 4, name: 'Item4' },
  );

  expect(origin.slice(1, 3)).toEqual([
    { id: 2, name: 'Item2' },
    { id: 4, name: 'Item4' },
  ]);
});

describe('treeDeep() 测试', () => {
  const tree = [
    {
      id: 1,
      list: [
        { id: 11 },
        { id: 12,
          list: [
            { id: 121 },
            { id: 122 },
          ],
        },
      ],
    },
    { id: 2 },
  ];

  test('treeDeep() 基本功能', () => {
    expect(treeDeep(tree, 'list')).toBe(3);
  });

  test('treeDeep() 附加深度数据到分支元素上', () => {
    const cloneTree = cloneDeep(tree);
    treeDeep(cloneTree, 'list', true, 'deep');
    expect(cloneTree)
      .toEqual([
        {
          id: 1,
          deep: 2,
          list: [
            {
              id: 11,
              deep: 0,
            },
            {
              id: 12,
              deep: 1,
              list: [
                {
                  id: 121,
                  deep: 0,
                },
                {
                  id: 122,
                  deep: 0,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          deep: 0,
        },
      ]);
  });
});

describe('deepReduce() 测试', () => {
  const tree = [
    {
      id: 1,
      list: [
        { id: 11 },
        { id: 12,
          list: [
            { id: 121 },
            { id: 122 },
          ],
        },
      ],
    },
    { id: 2 },
  ];

  test('deepReduce() 测试', () => {
    const callback = jest.fn((prev, curr) => {
      prev.push(curr.id);
      return prev;
    });

    const res = deepReduce<number[]>(tree, 'list', callback, []);

    expect(res).toEqual([1, 11, 12, 121, 122, 2]);

    expect(callback.mock.calls.length).toBe(6);
  });
});

describe('settleTree() 测试', () => {
  const tree = [
    {
      id: 1,
      name: '1',
      list: [
        {
          id: 11,
          name: '11',
        },
        {
          id: 12,
          name: '12',
          list: [
            {
              id: 121,
              name: '121',
            },
            {
              id: 122,
              name: '122',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: '2',
    },
  ];

  test('settleTree() 基本测试', () => {
    const cloneTree = cloneDeep(tree);
    const res = settleTree(cloneTree, {
      key: 'id',
      title: 'name',
    }, 'list');

    expect(res).toEqual([{
      id: 1,
      key: 1,
      name: '1',
      title: '1',
      list: [{
        id: 11,
        key: 11,
        name: '11',
        title: '11',
      }, {
        id: 12,
        key: 12,
        name: '12',
        title: '12',
        list: [{
          id: 121,
          key: 121,
          name: '121',
          title: '121',
        }, {
          id: 122,
          key: 122,
          name: '122',
          title: '122',
        }],
        children: [{
          id: 121,
          key: 121,
          name: '121',
          title: '121',
        }, {
          id: 122,
          key: 122,
          name: '122',
          title: '122',
        }],
      }],
      children: [{
        id: 11,
        key: 11,
        name: '11',
        title: '11',
      }, {
        id: 12,
        key: 12,
        name: '12',
        title: '12',
        list: [{
          id: 121,
          key: 121,
          name: '121',
          title: '121',
        }, {
          id: 122,
          key: 122,
          name: '122',
          title: '122',
        }],
        children: [{
          id: 121,
          key: 121,
          name: '121',
          title: '121',
        }, {
          id: 122,
          key: 122,
          name: '122',
          title: '122',
        }],
      }],
    }, {
      id: 2,
      key: 2,
      name: '2',
      title: '2',
    }]);
  });

  test('settleTree() Function Alias', () => {
    const cloneTree = cloneDeep(tree);
    const res = settleTree(cloneTree, {
      key: (item, index, prefix) => [...prefix, item].map(one => one.id).join('-'),
      title: 'name',
    }, 'list');

    expect(res).toEqual([{
      id: 1,
      key: '1',
      name: '1',
      title: '1',
      list: [{
        id: 11,
        key: '1-11',
        name: '11',
        title: '11',
      }, {
        id: 12,
        key: '1-12',
        name: '12',
        title: '12',
        list: [{
          id: 121,
          key: '1-12-121',
          name: '121',
          title: '121',
        }, {
          id: 122,
          key: '1-12-122',
          name: '122',
          title: '122',
        }],
        children: [{
          id: 121,
          key: '1-12-121',
          name: '121',
          title: '121',
        }, {
          id: 122,
          key: '1-12-122',
          name: '122',
          title: '122',
        }],
      }],
      children: [{
        id: 11,
        key: '1-11',
        name: '11',
        title: '11',
      }, {
        id: 12,
        key: '1-12',
        name: '12',
        title: '12',
        list: [{
          id: 121,
          key: '1-12-121',
          name: '121',
          title: '121',
        }, {
          id: 122,
          key: '1-12-122',
          name: '122',
          title: '122',
        }],
        children: [{
          id: 121,
          key: '1-12-121',
          name: '121',
          title: '121',
        }, {
          id: 122,
          key: '1-12-122',
          name: '122',
          title: '122',
        }],
      }],
    }, {
      id: 2,
      key: '2',
      name: '2',
      title: '2',
    }]);
  });
});

describe('buildTree() 测试', () => {
  test('buildTree() 最简用例', () => {
    expect(buildTree([
      { id: 1, pid: 0, name: 'Item1' },
      { id: 2, pid: 1, name: 'Item2' },
    ])).toEqual([{
      id: 1,
      pid: 0,
      name: 'Item1',
      children: [
        { id: 2, pid: 1, name: 'Item2', children: [] },
      ],
    }]);
  });

  test('buildTree() 自定义 pid,id', () => {
    expect(buildTree([
      { menuId: 1, parentId: 0, title: 'Menu1' },
      { menuId: 2, parentId: 1, title: 'Menu1-1' },
    ], 'menuId', 'parentId')).toEqual([{
      menuId: 1,
      parentId: 0,
      title: 'Menu1',
      children: [
        { menuId: 2, parentId: 1, title: 'Menu1-1', children: [] },
      ],
    }]);
  });

  test('buildTree() 乱序数据', () => {
    expect(buildTree([
      { menuId: 111, parentId: 11, title: 'Menu1-1-1' },
      { menuId: 11, parentId: 1, title: 'Menu1-1' },
      { menuId: 1, parentId: 0, title: 'Menu1' },
    ], 'menuId', 'parentId')).toEqual([{
      menuId: 1,
      parentId: 0,
      title: 'Menu1',
      children: [{
        menuId: 11,
        parentId: 1,
        title: 'Menu1-1',
        children: [{
          menuId: 111,
          parentId: 11,
          title: 'Menu1-1-1',
          children: [],
        }],
      }],
    }]);
  });

  test('buildTree() 小树变大树', () => {
    const res = buildTree([
      { menuId: 111, parentId: 11, title: 'Menu1-1-1' },
      { menuId: 11, parentId: 1, title: 'Menu1-1' },
      {
        menuId: 1,
        parentId: 0,
        title: 'Menu1',
        children: [
          { menuId: 12, parentId: 1, title: 'Menu1-2', children: [] },
        ],
      },
    ], 'menuId', 'parentId');

    expect(res).toEqual([{
      menuId: 1,
      parentId: 0,
      title: 'Menu1',
      children: [{
        menuId: 12,
        parentId: 1,
        title: 'Menu1-2',
        children: [],
      }, {
        menuId: 11,
        parentId: 1,
        title: 'Menu1-1',
        children: [{
          menuId: 111,
          parentId: 11,
          title: 'Menu1-1-1',
          children: [],
        }],
      }],
    }]);
  });
});
