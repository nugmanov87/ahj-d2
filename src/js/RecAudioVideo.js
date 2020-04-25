/* eslint-disable class-methods-use-this */
// eslint-disable-next-line import/no-extraneous-dependencies
const uuid = require('uuid');

export default class RecAudioVideo {
  constructor(popup, transferMsg) {
    this.popup = popup;
    this.transferMsg = transferMsg;
  }

  init() {
    this.bAudio = document.querySelector('#audio');
    this.bVideo = document.querySelector('#video');
    this.bPlayOk = document.querySelector('#play-ok');
    this.bPlayCancel = document.querySelector('#play-cancel');
    this.bPlayTimer = document.querySelector('#timer');
    this.elStartRec = document.querySelector('.start-rec');
    this.elStopRec = document.querySelector('.stop-rec');
    // const mVideo = document.querySelector('#video');

    this.bAudio.addEventListener('click', () => {
      this.elStartRec.classList.add('hidden');
      this.elStopRec.classList.remove('hidden');
      this.audioRecorder();
    });

    this.bVideo.addEventListener('click', () => {
      this.elStartRec.classList.add('hidden');
      this.elStopRec.classList.remove('hidden');
      this.audioRecorder(true);
    });
  }

  async audioRecorder(tVideo = false) {
    if (!navigator.mediaDevices) {
      const title = 'Что-то пошло не так';
      const msg = 'Браузер не поддерживает';
      this.popup.showPopup('', title, msg);
      this.elStartRec.classList.add('hidden');
      this.elStopRec.classList.add('hidden');
      return;
    }
    try {
      let saveCancel = true;
      let timmm = 0;
      let timers = null;

      if (!window.MediaRecorder) {
        const title = 'Что-то пошло не так';
        const msg = 'Дайте разрешение на запись звука в браузере';
        this.popup.showPopup('', title, msg);
        this.elStopRec.classList.add('hidden');
        this.elStartRec.classList.add('hidden');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: tVideo,
      });

      if (tVideo) {
        // const mVideo = document.querySelector('#video');
        const mVideo = document.createElement('video');
        mVideo.controls = true;
        mVideo.muted = 'muted';
        mVideo.className = 'mini-video';
        document.body.appendChild(mVideo);
        mVideo.srcObject = stream;
        mVideo.play();
      }

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.start();

      recorder.addEventListener('start', () => {
        timers = setInterval(() => {
          this.bPlayTimer.innerText = this.timer((timmm += 1));
        }, 1000);
      });

      recorder.addEventListener('dataavailable', (evt) => {
        chunks.push(evt.data);
      });

      recorder.addEventListener('stop', async () => {
        clearInterval(timers);
        this.bPlayTimer.innerText = '00:00';
        if (saveCancel) {
          let curMedia = 'audio';
          if (tVideo) {
            curMedia = 'video';
          }
          const itemId = uuid.v4();
          const element = document.createElement(curMedia);

          const blob = new Blob(chunks, { type: `${curMedia}/mp4` });

          const fr = new FileReader();
          fr.readAsDataURL(blob);

          fr.onload = () => {
            element.src = fr.result;
            element.controls = true;

            const objMessage = {
              id: itemId,
              type: curMedia,
              pin: false,
              favorit: false,
              msg: fr.result,
              // msg: dataFile,
              dateTime: new Date(),
            };
            this.transferMsg.sendMessage(objMessage);

            // cmessageAddGeo.messageAddGEO(element.outerHTML, this.popup);
          };
        }
        if (tVideo) {
          document.body.removeChild(document.querySelector('.mini-video'));
        }
        this.elStartRec.classList.remove('hidden');
        this.elStopRec.classList.add('hidden');
      });

      this.bPlayOk.addEventListener('click', () => {
        recorder.stop();
        // eslint-disable-next-line arrow-parens
        stream.getTracks().forEach((track) => track.stop());
        saveCancel = true;
      });

      this.bPlayCancel.addEventListener('click', () => {
        recorder.stop();
        // clearInterval(timers);
        // eslint-disable-next-line arrow-parens
        stream.getTracks().forEach((track) => track.stop());
        saveCancel = false;
      });
    } catch (e) {
      const title = 'Что-то пошло не так...';
      const msg = 'Дайте разрешение на запись звука/видео в браузере';
      // const msg = 'Запрошенное устройство не найдено!!!!';
      this.popup.showPopup('', title, msg);
      this.elStopRec.classList.add('hidden');
      this.elStartRec.classList.add('hidden');
    }
  }

  timer(seconds) {
    const minuts = Math.floor(seconds / 60);
    const second = seconds - minuts * 60;

    return `${minuts < 10 ? `0${minuts}` : minuts}:${
      second < 10 ? `0${second}` : second
    }`; // eslint-disable-line prefer-template
  }
}
