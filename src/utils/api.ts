export const apiRoutes: {
  [key: string]: string;
} = {};

/**
 * 路由解析
 *
 * @param routeName
 * @param params
 * @returns {*}
 */
export function route(routeName: string, params: { [key: string]: string }) {
  // eslint-disable-next-line no-param-reassign
  params = typeof params !== 'object' ? {} : params;

  if (apiRoutes[routeName] === undefined) {
    throw new Error(`api.routeParser: route is not found "${routeName}"`);
  }

  let url = apiRoutes[routeName];

  // 匹配占位符
  const placeholders = url.match(/({(.*?)})/g);
  const placeholderNames: string[] = [];

  // 替换占位符 (params)
  if (placeholders) {
    for (let i = 0; i < placeholders.length; i++) {
      const item = placeholders[i];
      const isNecessary = !/\?}$/.test(item);
      const paramName = item.replace(/^{/, '').replace(/\??}$/, '');

      // 如未传入必须参数则抛出异常
      if (isNecessary && !Object.prototype.hasOwnProperty.call(params, paramName)) {
        throw new Error(`api.routeParser: param"${paramName}" is necessary`);
      }

      const replace = params[paramName] !== null ? params[paramName] : '';

      url = url.replace(item, replace);

      placeholderNames.push(paramName);
    }
  }

  // 格式化 host & path
  const proto = url.slice(0, url.indexOf('://') + 3);
  const domainAndPath = url.slice(url.indexOf('://') + 3);
  url = proto + domainAndPath.replace(/\/{2,}/g, '/').replace(/\/$/, '');

  // 生成 query
  const query: string[] = [];
  Object.entries(params).forEach(([name, val]) => {
    if (placeholderNames.indexOf(name) === -1) {
      query.push(`${name}=${val}`);
    }
  });

  url = query.length ? `${url}?` : url;
  url += query.join('&');

  return url;
}
