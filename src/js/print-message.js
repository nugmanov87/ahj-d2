/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
// eslint-disable-next-line import/no-unresolved
import hljs from 'highlight.js';
// eslint-disable-next-line import/no-unresolved
import 'highlight.js/styles/github.css';
import printTime from './print-time.js';

export default class PrintMessage {
  constructor(parentEl, crypton) {
    this.parentEl = parentEl;
    this.crypton = crypton;
  }

  printMsg(messageObj, insertPosition) {
    const itemMsg = messageObj.msg;
    let msgHtml = '';

    switch (messageObj.type) {
      case 'textMsg':
        msgHtml = this.printTextMsg(itemMsg);
        break;
      case 'image':
        msgHtml = this.printImg(itemMsg, messageObj.name);
        break;
      case 'video':
        msgHtml = this.printVideo(itemMsg, messageObj.name);
        break;
      case 'audio':
        msgHtml = this.printAudio(itemMsg, messageObj.name);
        break;
      default:
        msgHtml = this.printApp(itemMsg, messageObj.name);
        break;
    }

    const elItemMsg = document.createElement('div');
    elItemMsg.className = 'item-message loaded no-favorit';
    elItemMsg.dataset.id = messageObj.id;
    elItemMsg.innerHTML = `
    ${msgHtml}
    <div class="footer-msg">
      <div class="like av${messageObj.favorit ? ' favorit' : ''}"></div>
      <div class="date-time">${printTime(messageObj.dateTime)}</div>
    </div>
    `;
    if (insertPosition === 'end') {
      this.parentEl.appendChild(elItemMsg);
      this.parentEl.scrollTo(0, elItemMsg.offsetTop);
    } else {
      this.parentEl.prepend(elItemMsg);
    }
  }

  printTextMsg(message) {
    const regExp = /(https?:\/\/)[%:\w.\/-]+/; // eslint-disable-line no-useless-escape
    const regExpCod = /```(.|\n)*?```/;
    let htmlMsg = message;

    if (htmlMsg === '') {
      result = null;
    }

    if (htmlMsg === 'terminator:') {
      result = null;
    }

    if (message.search(regExp) !== -1) {
      htmlMsg = message.replace(
        regExp,
        `
      <a href="${message.match(regExp)[0]}">${message.match(regExp)[0]}</a>
    `,
      );
    }

    if (message.search(regExpCod) !== -1) {
      const textCode = message.match(regExpCod)[0].replace(/```\n?/g, '');
      const highlightedCode = hljs.highlightAuto(textCode.trim()).value;
      htmlMsg = message.replace(
        regExpCod,
        `
      <pre><code>${highlightedCode}</code></pre>
      `,
      );
    }
    return `
      ${htmlMsg}
    `;
  }

  printImg(img, name) {
    const htmlMsg = `
      <img src="${img}">
      <p class="name">${name}</p>
      <a  class="download av" href="${img}" download="image"></a>
    `;
    return `
      ${htmlMsg}
    `;
  }

  printVideo(obj, name) {
    const htmlMsg = `
      <video src="${obj}" controls="controls"></video>
      <p class="name">${name}</p>
      <a class="download av" href="${obj}" download="video"></a>
    `;
    return `
      ${htmlMsg}
    `;
  }

  printAudio(obj, name) {
    const htmlMsg = `
      <audio src="${obj}" controls="controls"></audio>
      <p class="name">${name}</p>
      <a class="download av" href="${obj}" download="audio"></a>
    `;
    return `
      ${htmlMsg}
    `;
  }

  printApp(obj, name) {
    const htmlMsg = `
      <div class="applicat"></div>
      <p class="name">${name}</p>
      <a class="download av" href="${obj}" download="app"></a>
    `;
    return `
      ${htmlMsg}
    `;
  }
}
