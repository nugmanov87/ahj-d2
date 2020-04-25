import callPopup from './callPopup.js';

export default function getGEO(popup) {
  const popupInp = document.querySelector('.popup-inp');
  const popupCancel = document.querySelector('.popup-cancel');
  const popupOk = document.querySelector('.popup-ok');

  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`${latitude}, ${longitude}`);
        },
        (error) => {
          // eslint-disable-next-line max-len
          const msg = 'К сожалению, нам не удалось определить ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную. Введите Широту и долготу через запятую (45.0000, 54.0000)';
          callPopup(msg, popup);
          popupOk.addEventListener('click', () => {
            popup.showPopup('GEO ok', error);
            if (popup.validate()) {
              resolve(popupInp.value);
            }
          });
          popupCancel.addEventListener('click', () => {
            reject('cancel'); // eslint-disable-line prefer-promise-reject-errors
          });
        },
      );
    } else {
      const msg = 'Не поддерживает браузер. Введите широту и долготу через запятую';
      callPopup(msg, popup);

      popupOk.addEventListener('click', () => {
        popup.showPopup('GEO ok');
        if (popup.validate()) {
          resolve(popupInp.value);
        }
      });
      popupCancel.addEventListener('click', () => {
        reject('cancel'); // eslint-disable-line prefer-promise-reject-errors
      });
    }
  });
}

function validateGEO(coord) {
  if (
    coord.search(
      /^(\[?-?)((\d|[0-8]\d?|90)\.\d{4,}), ?(-|−)?((\d|\d\d|1[0-7][0-9]|180)\.\d{4,})(\]?)$/,
    ) !== -1
  ) {
    return true;
  }
  return false;
}

export { validateGEO };
