import { isIos } from './device';

declare global {
  interface Window {
    qfAppSide?: {
      invoke: (channel: string, params: any) => void;
    };
    qfHtmlSide: any;
    webkit?: { messageHandlers: Record<string, { postMessage: (params: any) => void }> };
  }
}

export const hasInvoke = (window.qfAppSide && window.qfAppSide.invoke) || (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.qfAppSideInvoke);

type BridgeCallback = (...args: any[]) => any;
const callbacks: Record<string, { callback: BridgeCallback }> = {};
const getCbName = () => `invoke_api_callback_${new Date().getTime()}_${Math.floor(Math.random() * 10000)}`;

/* ==----------------------- 主动请求数据 -----------------------== */
export function addCallback(name: string, cb: BridgeCallback) {
  delete callbacks[name];
  callbacks[name] = { callback: cb };
}

export function feedback({ callbackName, ...params }: { callbackName: string; [key: string]: any }) {
  const cbMethod = callbacks[callbackName];
  if (cbMethod) {
    const ret = cbMethod.callback(params);
    if (ret === false) return;
    delete callbacks[callbackName];
  }
}

export function invoke(channel: string, params = {}) {
  if (isIos()) {
    const message = { channel, params };

    if (hasInvoke) {
      window.webkit!.messageHandlers.qfAppSideInvoke.postMessage(message);
    }
  } else {
    window.qfAppSide!.invoke(channel, JSON.stringify(params));
  }
}

export function invokeWithCallback(channel: string, params: BridgeCallback | Record<string, any>, cb?: BridgeCallback) {
  if (typeof params === 'function') {
    // eslint-disable-next-line no-param-reassign
    cb = params as BridgeCallback;
    // eslint-disable-next-line no-param-reassign
    params = {};
  }

  const cbName = getCbName();
  addCallback(cbName, cb!);
  if (isIos()) {
    const message = { channel, callback: cbName, params };
    if (hasInvoke) {
      window.webkit!.messageHandlers.qfAppSideInvoke.postMessage(message);
    }
  } else {
    params.callback = cbName;
    window.qfAppSide!.invoke(channel, JSON.stringify(params));
  }
}

/* ==----------------------- 接受事件调用 -----------------------== */
const listeners: Record<string, BridgeCallback[]> = {};
export function on(eventNames: string | string[], callback: BridgeCallback) {
  // 判断是否是数组
  // eslint-disable-next-line no-param-reassign
  eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
  for (let index = 0; index < eventNames.length; index++) {
    const eventName = eventNames[index];
    listeners[eventName] = listeners[eventName] || [];
    listeners[eventName].push(callback);
  }
}

export function off(eventNames: string | string[], callback: BridgeCallback) {
  // eslint-disable-next-line no-param-reassign
  eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
  for (let index = 0; index < eventNames.length; index++) {
    const eventName = eventNames[index];
    // 如果已经注册有事件 则移除当前要移除的事件
    if (listeners[eventName]) {
      listeners[eventName] = listeners[eventName].filter((cb) => cb !== callback);
    }
  }
}

export function emit({ name: eventName, params: callbackParams }: { name: string; params: Record<string, any> }) {
  // 注册有事件监听则遍历挨个触发
  if (listeners[eventName]) {
    listeners[eventName].forEach((eventCallback) => {
      eventCallback(eventName, callbackParams);
    });
  }
}

window.qfHtmlSide = { emit, feedback };
