/* eslint-disable class-methods-use-this */
import printTime from './printTime.js';

export default class BotChat {
  constructor(parentEl) {
    this.weather = [
      'За окном ливень и град!!!',
      'Не забудьте взять зонтик и плащь',
      'Температура на улице +40',
      'Дождь со снегом, осторожней - гололед!',
      'Жарко, но терпимо',
      'Сегодня -20 и снег',
    ];
    this.toGo = [
      'Можно сходить в кино',
      'Если погода позволяет, то конечно же - на природе',
      'Сходите с друзьями в пиццерию',
      'Оставайтесь дома - на улице коронавирус!!!',
    ];
    this.likeYou = [
      'Лучше всех!',
      'Печально(',
      'Все отлично! А как ты ?',
      'Сойдет',
      'Теперь стало намного лучше',
    ];
    this.whatSee = [
      'Мультфильмы уолтдисней',
      'Терминатор 6 - самое то)',
      'Новости спорта - почему бы и нет?',
      'Ну погоди',
      'Сказку про золотую рыбку',
      'Мылодрамму с Сергеем Буруновым',
      'Оперу в театре',
    ];
    this.howTime = [
      'Почитать книжку',
      'Покодить',
      'Убраться в квартире',
      'Поигарть в футбол с друзьями',
      'Пригласить друзей в гости поиграть в монополию',
      'Съездить на рыбалку',
      'Сходи прогуляйся - подыши свежим воздухом, ну или просто подыши',
    ];
    this.parentEl = parentEl;
  }

  funcBot(msg) {
    let msgHtml = '';
    let itemMsg = document.createElement('div');
    itemMsg.className = 'item-message no-favorit';
    itemMsg.innerHTML = `
    ${msg}
    <div class="footer-msg">
      <div class="date-time">${printTime(new Date())}</div>
    </div>
    `;
    this.parentEl.appendChild(itemMsg);

    const question = msg.replace(/^terminator: /, '');

    switch (question) {
      case 'погода':
        msgHtml = this.randomMsg(this.weather);
        break;
      case 'куда сходить?':
        msgHtml = this.randomMsg(this.toGo);
        break;
      case 'как дела?':
        msgHtml = this.randomMsg(this.likeYou);
        break;
      case 'что посмотреть?':
        msgHtml = this.randomMsg(this.whatSee);
        break;
      case 'как лучше провести время?':
        msgHtml = this.randomMsg(this.howTime);
        break;
      default:
        msgHtml = 'Вы отправили пустое сообщение, либо ваш вопрос некорректен. Пожалуйста, уточните ваш вопрос.';
        break;
    }

    itemMsg = document.createElement('div');
    itemMsg.className = 'item-message no-favorit bot';
    itemMsg.innerHTML = `
    ${msgHtml}
    <div class="footer-msg">
      <div class="date-time">${printTime(new Date())}</div>
    </div>
    `;
    this.parentEl.appendChild(itemMsg);
  }

  randomMsg(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
}
