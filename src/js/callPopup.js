export default function callPopup(msg, popup) {
  const title = 'Что-то пошло не так';
  popup.showPopup('get', title, msg);
}
