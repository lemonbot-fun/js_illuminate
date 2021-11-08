import enquireJs from 'enquire.js';

export const DEVICE_TYPE = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile',
};

export function deviceEnquire(callback?: (deviceType: string) => void) {
  const matchDesktop = {
    match: () => {
      callback && callback(DEVICE_TYPE.DESKTOP);
    },
  };

  const matchLablet = {
    match: () => {
      callback && callback(DEVICE_TYPE.TABLET);
    },
  };

  const matchMobile = {
    match: () => {
      callback && callback(DEVICE_TYPE.MOBILE);
    },
  };

  // screen and (max-width: 1087.99px)
  enquireJs.register('screen and (max-width: 576px)', matchMobile).register('screen and (min-width: 576px) and (max-width: 1199px)', matchLablet).register('screen and (min-width: 1200px)', matchDesktop);
}

const variables: { [key: string]: string } = {
  system: 'android',
  medium: 'mobile',
  client: 'wechat',
};

function init() {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    variables.system = 'ios';
  } else if (/(Android)/i.test(navigator.userAgent)) {
    variables.system = 'android';
  } else if (navigator.platform === 'win32') {
    variables.system = 'windows';
  } else {
    variables.system = 'mac';
  }
}

init();

function varIs(name: string, point: string | string[]) {
  if (typeof point === 'string') {
    return variables[name] === point;
  }
  return point.indexOf(variables[name]) !== -1;
}

function varNot(name: string, point: string | string[]) {
  if (typeof point === 'string') {
    return variables[name] !== point;
  }
  return point.indexOf(variables[name]) === -1;
}

/* =-------------------= 系统判断 =-------------------= */
export function systemIs(point: string | string[]) {
  return varIs('system', point);
}

export function systemNot(point: string | string[]) {
  return varNot('system', point);
}

export function isAndriod() {
  return systemIs('android');
}

export function isIos() {
  return systemIs('ios');
}

/* =-------------------= 媒介判断 =-------------------= */
export function mediumIs(point: string | string[]) {
  return varIs('medium', point);
}

export function mediumNot(point: string | string[]) {
  return varNot('medium', point);
}

export function isInMobile() {
  return mediumIs('mobile');
}

/* =-------------------= 客户端判断 =-------------------= */
export function clientIs(point: string | string[]) {
  return varIs('client', point);
}

export function clientNot(point: string | string[]) {
  return varNot('client', point);
}

export function isInApp() {
  return clientIs('app');
}

export function isInWechat() {
  return clientIs('wechat');
}
