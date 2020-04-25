// eslint-disable-next-line import/no-unresolved
import Worker from './web-worker.js';
import PrintMessage from './print-message.js';
import CryptKey from './CryptKey.js';

const localArrMessages = [];
const urls = 'ahj-diplom-server.herokuapp.com';

export default class TransferMessage {
  constructor(crypt) {
    this.keyCrypt = crypt;
    this.urlWS = `wss://${urls}/ws`;
    this.url = `https://${urls}/`;
    this.crypt = new CryptKey(crypt);
    this.lazyStart = true;
  }

  async init() {
    this.elListMessages = document.querySelector('.display-legends');
    this.printMsg = new PrintMessage(this.elListMessages, this.crypt);
    this.initWS();
    const resp = await fetch(`${this.url}initmsg`);
    await resp.text();
    this.lazyLoad();
  }

  initWS() {
    this.ws = new WebSocket(this.urlWS);
    this.ws.addEventListener('open', () => {});

    this.ws.addEventListener('message', (evt) => {
      const inpMsg = JSON.parse(evt.data);
      const itemEl = document.querySelector(`[data-id="${inpMsg.id}"]`);

      if (itemEl !== null) {
        itemEl.classList.remove('loaded');
        return;
      }

      const deCrypt = this.crypt.deCrypt(inpMsg.msg);

      if (deCrypt && deCrypt !== null) {
        inpMsg.msg = deCrypt;
        localArrMessages.push(inpMsg);
        this.printMsg.printMsg(inpMsg, 'end');
        document
          .querySelector(`[data-id="${inpMsg.id}"]`)
          .classList.remove('loaded');
      }
    });
  }

  sendMessage(message) {
    localArrMessages.push(message);
    this.printMsg.printMsg(message, 'end');

    if (this.ws.readyState === WebSocket.OPEN) {
      this.uploadMsg(message);
    } else {
      this.ws = new WebSocket(this.urlWS);
      this.uploadMsg(message);
    }
  }

  uploadMsg(message) {
    const worker = new Worker();
    worker.addEventListener('message', (event) => {
      this.ws.send(JSON.stringify(event.data));
      worker.terminate();
    });

    worker.postMessage({
      file: message,
      keyCrypt: this.keyCrypt,
      workCrypt: 'enCrypt',
    });
  }

  async lazyLoad() {
    if (this.lazyStart) {
      this.lazyStart = false;
      const lengthItem = localArrMessages.length;
      const resp = await fetch(`${this.url}msg/${lengthItem}`);
      const body = await resp.json();

      let lengthDown = body.length;
      const worker = new Worker();
      worker.addEventListener('message', (event) => {
        if (event.data.msg && event.data.msg !== null) {
          localArrMessages.push(event.data);
          this.printMsg.printMsg(event.data, 'start');
          document
            .querySelector(`[data-id="${event.data.id}"]`)
            .classList.remove('loaded');
        }
        lengthDown -= 1;
        if (lengthDown === 0) {
          this.lazyStart = true;
        }
      });

      worker.postMessage({
        file: body,
        keyCrypt: this.keyCrypt,
        workCrypt: 'deCrypt',
      });
    }
  }

  changeFavorit(idElement, data) {
    const itemIndex = localArrMessages.findIndex(
      // eslint-disable-next-line arrow-parens
      (item) => item.id === idElement,
    );
    localArrMessages[itemIndex].favorit = data;

    fetch(`${this.url}favorits`, {
      body: JSON.stringify({
        id: idElement,
        value: data,
      }),
      method: 'POST',
      headers: this.contentTypeHeader,
    });
  }

  async exportHistory() {
    const filename = 'history.json';
    const resp = await fetch(`${this.url}allmsg`);
    const body = await resp.json();
    const jsonStr = JSON.stringify(body);

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(jsonStr)}`,
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
