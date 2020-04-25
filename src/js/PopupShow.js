/* eslint-disable import/no-named-as-default */
import validateGEO from './getGeolocation.js';

export default class PopupShow {
  init() {
    this.popup = document.createElement('div');
    this.popup.className = 'popup hidden';
    this.popup.innerHTML = `
    <p class="popup-header"></p>
    <p class="popup-msg"></p>
    <input type"text" class="popup-inp hidden">
    <div class="popup-buttons">
      <div class="popup-cancel button hidden">Отмена</div>
      <div class="popup-ok button">OK</div>
    </div>
    `;
    document.body.appendChild(this.popup);

    this.popupHeader = document.querySelector('.popup-header');
    this.popupMsg = document.querySelector('.popup-msg');
    this.popupInp = document.querySelector('.popup-inp');
    this.popupCancel = document.querySelector('.popup-cancel');
  }

  showPopup(type, header, msg) {
    this.popup.classList.remove('hidden');
    this.popupHeader.innerText = header;
    this.popupMsg.innerText = msg;
    if (type === 'get') {
      this.popupInp.classList.remove('hidden');
      this.popupCancel.classList.remove('hidden');
    }
  }

  validate() {
    if (validateGEO(this.popupInp.value)) {
      this.popupInp.style.borderColor = '#000000';
      return true;
    }
    this.popupInp.style.borderColor = '#ff0000';
    return false;
  }
}
