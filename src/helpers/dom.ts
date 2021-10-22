export function setDocumentTitle(title: string) {
  document.title = title;
  const ua = navigator.userAgent;
  // eslint-disable-next-line
  const regex = /\bMicroMessenger\/([\d.]+)/
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const frame = document.createElement('iframe');
    frame.src = '/favicon.ico';
    frame.style.display = 'none';
    frame.onload = () => {
      setTimeout(() => {
        frame.remove();
      }, 9);
    };
    document.body.appendChild(frame);
  }
}

export const domTitle = 'NL SAAS';

/**
 * 将图片渲染到 画布
 */
export function renderImageToCanvas(imgFile: File, canvas: HTMLCanvasElement) {
  const canvasRect = canvas.getBoundingClientRect();
  canvas.width = canvasRect.width;
  canvas.height = canvasRect.height;
  const canvasRadio = canvasRect.width / canvasRect.height;

  const reader = new FileReader();
  const ctx = canvas.getContext('2d')!;

  reader.onload = (event: any) => {
    const img = new Image();

    img.onload = () => {
      const imgRadio = img.width / img.height;

      let drawX = 0;
      let drawY = 0;
      let drawWidth = 0;
      let drawHeight = 0;

      if (imgRadio > canvasRadio) {
        // 宽图
        drawWidth = canvasRect.width;
        drawHeight = img.height * (canvasRect.width / img.width);
        drawX = 0;
        drawY = (canvasRect.height - drawHeight) / 2;
      } else {
        // 窄图
        drawWidth = img.width * (canvasRect.height / img.height);
        drawHeight = canvasRect.height;
        drawX = (canvasRect.width - drawWidth) / 2;
        drawY = 0;
      }

      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(0, 0, canvasRect.width, canvasRect.height);
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    };
    img.src = event.target!.result as string;
  };

  reader.readAsDataURL(imgFile);
}

export function dispatchDownload(name: string, dataUrl: string) {
  const a = document.createElement('a');
  a.download = name;
  a.href = dataUrl;
  a.target = '_blank';
  const event = new MouseEvent('click');
  a.dispatchEvent(event);
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents');
  event.initEvent('resize', true, true);
  window.dispatchEvent(event);
}

export function handleScrollHeader(callback: Function) {
  let timer = 0;

  let beforeScrollTop = window.pageYOffset;
  callback = callback || (() => null);
  window.addEventListener(
    'scroll',
    () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        let direction = 'up';
        const afterScrollTop = window.pageYOffset;
        const delta = afterScrollTop - beforeScrollTop;
        if (delta === 0) {
          return false;
        }
        direction = delta > 0 ? 'down' : 'up';
        callback(direction);
        beforeScrollTop = afterScrollTop;
      }, 50);
    },
    false,
  );
}

/**
 * 获取元素 父级节点
 * @param el
 */
export function parent(el: HTMLElement) {
  return el.parentNode;
}

/**
 * 获取兄弟节点
 * @param el
 */
export function siblings(el: HTMLElement) {
  return Array.prototype.filter.call(el.parentNode!.children, child => child !== el);
}

/**
 * 将字符串转为 DOM 元素
 * @param str
 */
export function parseHTML(str: string) {
  const context = document.implementation.createHTMLDocument();

  // Set the base href for the created document so any parsed elements with URLs
  // are based on the document's URL
  const base = context.createElement('base');
  base.href = document.location.href;
  context.head.appendChild(base);

  context.body.innerHTML = str;
  return context.body.children;
}

