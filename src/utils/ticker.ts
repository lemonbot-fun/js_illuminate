/* eslint-disable no-use-before-define */
import bus from './events';
import { sureOffline } from '../helpers/bom';

const EVENT_TICKER_MESSAGE = 'EVENT_TICKER_MESSAGE';

export type TickerActions = 'subscribe' | 'unsubscribe';

export type AR = {
  channel: string,
  [key: string]: any,
};

type TickerPayload = { op: TickerActions, ar: [AR] };

export const channelsList = {
  CHANNEL_ORDER: 'order',
  CHANNEL_TICKER: 'ticker',
  CHANNEL_CANDLES: 'candles', // K线
  CHANNEL_DEPTH: 'depth', // 深度数据
  CHANNEL_BPI_DATE: 'bpiDate',
  CHANNEL_DAK: 'detailAndK',
};

let getPingId = () => 0;
let pingDelay = 1000;
let socket: WebSocket | null;
let reconnectId!: number;
let reconnectDelay: number = 5000;
let resetReconnectDelayId!: number;
let loopId!: number;
let latestConnectAt: number = 0;
const workerQueue: any[] = [];

// 链接 Socket
function connect() {
  const onClose = () => {
    window.clearInterval(resetReconnectDelayId);
    // 快速断链的情况下 逐次增加重连等待时间
    const now = (new Date()).getTime();
    if (now - latestConnectAt < 20000) {
      reconnectDelay += 5000;
    }

    socket = null;
    stopLoop();
    stopPing();

    // 链接断开且有订阅频道交易对
    if (subscribedAr.length) {
      startReConnect();
    }
  };

  try {
    stopReConnect();
    latestConnectAt = (new Date()).getTime();
    socket = new WebSocket('url');

    // Listen for messages
    socket.addEventListener('message', (evt: MessageEvent) => {
      if (!/^{.*}$/.test(evt.data)) return;

      try {
        bus.emit(EVENT_TICKER_MESSAGE, JSON.parse(evt.data));
      } catch (e) {
        // empty
      }
    });

    // Connection opened
    socket.addEventListener('open', () => {
      stopReConnect();
      startPing();
      startLoop();
      // 稳定连接 5s 后重置重连等待时间
      window.clearInterval(resetReconnectDelayId);
      resetReconnectDelayId = window.setTimeout(() => {
        // 本地链接稳定后重置重连延迟
        reconnectDelay = 5000;
      }, 20000);
    });

    socket.addEventListener('close', onClose);
  } catch (e) {
    onClose();
    console.log('Socket 链接失败:', e);
  }
}

// 开始任务处理循环监听
function startLoop() {
  loopId = window.setInterval(() => {
    if (socket && socket!.readyState === WebSocket.OPEN) {
      const worker = workerQueue.shift();
      worker && worker();
    }
  }, 100);
}

// 停止任务处理监听
function stopLoop() {
  window.clearInterval(loopId);
}

// 断连后开始重试
function startReConnect() {
  if (reconnectId) return;
  reconnectId = window.setTimeout(async () => {
    startReConnect();

    // 离线状态不重连
    // eslint-disable-next-line no-restricted-syntax
    if (sureOffline()) {
      return;
    }

    await connect();

    if (subscribedAr.length) {
      reSubscribeAll();
    }
  }, reconnectDelay);
}

// 停止重试
function stopReConnect() {
  window.clearInterval(reconnectId);
  reconnectId = 0;
}

// 定时发送 ping
// 为了测试快速断链的情况 ping 的延迟逐次递增，
function startPing() {
  clearTimeout(getPingId());
  const pindId = window.setTimeout(() => {
    workerQueue.push(() => {
      socket!.send('ping');
      startPing();
      pingDelay += 1000;
    });
  }, pingDelay > 10000 ? 10000 : pingDelay);
  getPingId = ((id: number) => () => id)(pindId);
}

// 停止定时 ping
function stopPing() {
  pingDelay = 1000;
  window.clearInterval(getPingId());
}

// 工具方法用于生成 订阅消息
function makeAr(channel: string, params?: any) {
  return { channel, ...params };
}

function makePayload(action: TickerActions, ar: AR): TickerPayload {
  return { op: action, ar: [ar] };
}

let subscribedAr: { ar: AR, refNo: number }[] = [];

export class Channel {
  constructor(
    public channel: string,
    public params: any,
  ) {
    // Not empty
  }

  get ar() {
    return makeAr(this.channel, this.params);
  }

  /**
   * 退订
   */
  unSubscribe() {
    unSubscribe(this.ar);
  }
}

// 重连后重新订阅所有内容
async function reSubscribeAll() {
  subscribedAr.forEach(item => {
    workerQueue.push(() => {
      socket!.send(JSON.stringify(makePayload('subscribe', item.ar)));
    });
  });
}

// 订阅内容
export function subscribe(channel: string, params?: any) {
  !socket && connect();

  const cn = new Channel(channel, params);
  let found = false;
  subscribedAr.forEach(item => {
    if (JSON.stringify(item.ar) === JSON.stringify(cn.ar)) {
      found = true;
      item.refNo++;
    }
  });

  if (!found) {
    const worker = ((subPayload: TickerPayload) => () => {
      socket!.send(JSON.stringify(subPayload));
    })(makePayload('subscribe', cn.ar));

    workerQueue.push(worker);
    subscribedAr.push({ ar: cn.ar, refNo: 1 });
  }

  return cn;
}

function unSubscribe(ar: AR) {
  subscribedAr.forEach(item => {
    if (JSON.stringify(item.ar) !== JSON.stringify(ar)) return;

    item.refNo--;

    if (item.refNo === 0) {
      const worker = ((subPayload: TickerPayload) => () => {
        socket!.send(JSON.stringify(subPayload));
      })(makePayload('unsubscribe', ar));
      workerQueue.push(worker);
    }
  });

  subscribedAr = subscribedAr.filter(item => (item.refNo > 0));
}
