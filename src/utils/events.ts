import mitt from 'mitt';

const bus = mitt();

export function createBus() {
  return mitt();
}

export default bus;
