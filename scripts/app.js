// Start Variables Sections
let userData;

let modalStates = {
  'schedule-bttn': true, 
  'help-bttn': true, 
  'avatar-bttn': true, 
  'controls-bttn': true,
  'chat-bttn': true,
  'logout-bttn': true,
};

const modalsContainers = {
  'schedule-bttn': 'back-plate-schedule', 
  'help-bttn': 'tutorial-container', 
  'avatar-bttn': 'iframe-container', 
  'controls-bttn': 'back-plate-controll',
  'chat-bttn': 'container-chat',
  'logout-bttn': 'wrapper-modal-quit', 
};

const baseUrl = "https://admin-brasilagriland.com.br/services";
// End Variables Sections

// Start Utils Sections
function applyPaddingsForTotalHeight(buttonId, paragraphId) {
  const button = document.getElementById(buttonId);
  const paragraph = document.getElementById(paragraphId);

  const buttonHeight = button.offsetHeight;
  const fontPixelSize = parseFloat(window.getComputedStyle(paragraph).fontSize);
  const paddingTotal = buttonHeight - fontPixelSize;

  const padding = paddingTotal / 2;

  paragraph.style.paddingTop = padding - 1 + "px";
  paragraph.style.paddingBottom = padding - 1 + "px";
}

const genericCreateElement = (type, id, className) => {
  const element = document.createElement(type)
  element.className = className;
  element.id = id;

  return element;
};

const createPlayerHover = () => {
  const hoverPlayer = genericCreateElement('div', 'hover-player', "botón");
  
  hoverPlayer.classList.toggle('active');
  hoverPlayer.onclick = () => hoverPlayer.classList.toggle('active');


  const background = genericCreateElement('div', 'background-hover-player', 'fondo');
  const icon = genericCreateElement('div', 'icon-hover-player', 'icono');
  const leftSide = genericCreateElement('div', 'left-side-hover-player', 'parte izquierda');
  const rightSide = genericCreateElement('div', 'right-side-hover-player', 'parte derecha');
  const pointer = genericCreateElement('div', 'pointer', 'puntero');

  background.width = 200;
  background.height = 200;
  background.x = 0;
  background.y = 0;

  icon.width = 200;
  icon.height = 200;

  leftSide.width = 200;
  leftSide.height = 200;
  leftSide.x = 0;
  leftSide.y = 0;
  leftSide.fill = '#fff';

  rightSide.width = 200;
  rightSide.height = 200;
  rightSide.x = 0;
  rightSide.y = 0;
  rightSide.fill = '#fff';

  for (const el of [leftSide, rightSide]) icon.appendChild(el);
  for (const el of [background, icon, pointer]) hoverPlayer.appendChild(el);
  
  return hoverPlayer;
};

const circleLoadder = () => {
  const container = document.createElement('div');
  container.className = 'lds-roller';

  for (let i = 0; i < 8; i++) container.appendChild(document.createElement('div'));

  return container;
};

const updateAvatar = async (data) => {
  try {
    var request = new XMLHttpRequest(); 
    request.open('POST', `https://admin-brasilagriland.com.br/hub/auth/avatar/${data.id}`, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);

        console.log(data);
      }
    };

    request.onerror = function() {
      console.error('Erro na requisição.');
    };

    var jsonData = JSON.stringify(data);

    request.send(jsonData);
  } catch (err) {
    console.log(err);
  }
}

const getRequestBase = async (endPoint, onSuccess) => {
  try {
    var request = new XMLHttpRequest(); 
    request.open('GET', `https://admin-brasilagriland.com.br/hub/auth/schedule/${endPoint}`, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);

        onSuccess(data);
      }
    };

    request.onerror = function() {
      console.error('Erro na requisição.');
    };

    request.send();
  } catch (err) {
    console.log(err);
  }
}

async function fetchList() {
  return new Promise((resolve, reject) => {
    getRequestBase("?futures=true&dateType=obj", (data) => {
      resolve(data.data);
    });
  });
}

const emitUIInteraction = value => console.log(value);

function subscribe(event) {
  const frame = document.getElementById('rpm-iframe');
  const json = parse(event);

  if (json?.source !== 'readyplayerme') {
    return;
  }

  if (json.eventName === 'v1.frame.ready') {
    frame.contentWindow.postMessage(
      JSON.stringify({
        target: 'readyplayerme',
        type: 'subscribe',
        eventName: 'v1.**'
      }),
      '*'
    );
  }

  if (json.eventName === 'v1.avatar.exported') {
    const avatarBttn = document.getElementById('avatar-bttn');
    avatarBttn.style.backgroundImage = `url("${(json.data.url).replace('.glb', '.png')}")`;

    const data = {
      id: userData.rpmId,
      link: json.data.url,
    };

    updateAvatar(data);
    
    const iframeContaienr = document.getElementById('iframe-container');
    const playerUI = document.getElementById('playerUI');
    playerUI.removeChild(iframeContaienr);
  }

  if (json.eventName === 'v1.user.set') {
    console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
  }
}

function parse(event) {
  try {
      return JSON.parse(event.data);
  } catch (error) {
      return null;
  }
}

const serverLogin = () => {
  const root = document.getElementById('root');
  const playerUI = document.getElementById('playerUI');

  root.style.display = "none";
  playerUI.style.visibility = "visible";
}

const createButton = (id, className, onClick) => {
  const playerUI = document.getElementById('playerUI');
  let activeBttn = true;
  const button = genericCreateElement('button', id , className);

  button.onclick = () => {
    button.className = `${className}${activeBttn ? ' active' : ''}`
    activeBttn = !activeBttn;

    const state = modalStates[`${id}`];
    if (state) {
      const states = Object.entries(modalStates).filter(value => value[0] !== id);

      states.forEach(value => {
        const el = document.getElementById(modalsContainers[value[0]]);
        if (el) {
          playerUI.removeChild(el);
          const bttn = document.getElementById(value[0]);
          bttn.className = bttn.className.replace(' active', '');
        }
      });
    }

    onClick();
  };

  return button;
};

const createInput = (id, className, labelText, type) => {
  const input = genericCreateElement("input", id, '');
  const label = genericCreateElement("label", '', '');
  
  
  input.type = type;
  
  label.for = id;
  
  label.appendChild(document.createTextNode(labelText));

  const div = genericCreateElement("div", '', className);
    
  div.appendChild(label);
  div.appendChild(input);

  return div;
};

const createButtonWithText = (className, onClick, buttonText) => {
  const button = genericCreateElement("button", className, className);
  button.appendChild(document.createTextNode(buttonText));

  button.onclick = onClick;

  return button;
}

const createTitle = (text) => {
  const title = genericCreateElement("h1", '', '');
  title.style.color = "#dcdc01";
  title.appendChild(document.createTextNode(text));
  return title;
};

const createDivider = (className) => genericCreateElement("div", '', className);

const loading = () => {
  const mother = genericCreateElement("div", 'loading', 'lds-ellipsis');

  const one = genericCreateElement("div", '', '');
  const two = genericCreateElement("div", '', '');
  const three = genericCreateElement("div", '', '');
  const four = genericCreateElement("div", '', '');

  mother.appendChild(one);
  mother.appendChild(two);
  mother.appendChild(three);
  mother.appendChild(four);

  return mother;
}

const onSubmit = async () => {
  const alertContainer = document.getElementById("alert");
  alertContainer.innerHTML = "";

  const bttnSubmit = createButton("button-signin", onSubmit, "ENTRAR");
  const submitContainer = document.getElementById("submit-container")
  const animationLoading = loading();
  
  submitContainer.removeChild(document.getElementById('button-signin'));
  submitContainer.appendChild(animationLoading);
  
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
       
    const data = { email, password };

    var request = new XMLHttpRequest(); 
    request.open('POST', `${baseUrl}/unreal/signin`, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);

        if (data.data) {
          const emitData = {
            name: "login",
            value: data.data
          };
            
          // emitUIInteraction(emitData);
          userData = data.data;
          serverLogin();
          renderHud();
        } else if (!data.hasVerified && data.success) {
          let url = new URL("verify.html", window.location.href);
          url.searchParams.set("email", email);
          console.log(url);
          window.location.replace(url.href);
        } else if (!data.success)  {
          submitContainer.removeChild(animationLoading);
          submitContainer.appendChild(bttnSubmit);

          alertContainer.innerHTML = `<p>Email ou senha estão incorretos</p>`;
        }
      } else {
        console.log("aqui");
        submitContainer.removeChild(animationLoading);
        submitContainer.appendChild(bttnSubmit);

        console.error('Erro na requisição. Status:', request.status);
      }
    };

    request.onerror = function() {
      console.log("aqui2");
      submitContainer.removeChild(animationLoading);
      submitContainer.appendChild(bttnSubmit);

      console.error('Erro na requisição.');
    };

    request.send(JSON.stringify(data));
  } catch(err) {
    console.log("aqui3");
    submitContainer.removeChild(animationLoading);
    submitContainer.appendChild(bttnSubmit);

    console.log(err);
  }
};
// End Utils Sections

// Start Renders Sections
const renderQuit = () => {
  const playerUI = document.getElementById('playerUI');

  const closeBttn = genericCreateElement('button', 'close-bttn-quit', 'quit quit__close-bttn bttn');
  const quitBttn = genericCreateElement('button', 'quit-bttn', 'quit quit__content content__wrapper-bttn wrapper-bttn__bttn bttn');
  const quitBttnLabel = genericCreateElement('p', 'quit-bttn-label', 'quit-bttn-label');
  const quitBttnContainer = genericCreateElement('div', 'quit-bttn-container', 'quit quit__content content__wrapper-bttn display-flex-column')
  const header = genericCreateElement('p', 'header-quit', 'quit quit__content content__header');
  const text = genericCreateElement('p', 'text-quit', 'quit quit__content content__text');
  const contentModal = genericCreateElement('div', 'content-modal-quit', 'quit quit__content display-flex-column');
  const wrapperModal = genericCreateElement('div', 'wrapper-modal-quit', 'quit quit__container');

  closeBttn.appendChild(document.createTextNode('X'));
  closeBttn.onclick = () => {
    modalStates['logout-bttn'] = true;
    playerUI.removeChild(document.getElementById('wrapper-modal-quit'))
    const bttn = document.getElementById('logout-bttn');
    bttn.className = bttn.className.replace(' active', '');
  };

  quitBttn.onclick = () => {
    playerUI.removeChild(document.getElementById('wrapper-modal-quit'));
    playerUI.removeChild(document.getElementById('help-bttn'));
    playerUI.removeChild(document.getElementById('side-left-bar'));
    const root = document.getElementById('root');
    root.removeChild(document.getElementById('card-login'));
    root.style.display = '';
    modalStates = {
      'schedule-bttn': true, 
      'help-bttn': true, 
      'avatar-bttn': true, 
      'controls-bttn': true,
      'chat-bttn': true,
      'logout-bttn': true,
    };
    
    render();
  };
 
  quitBttnLabel.appendChild(document.createTextNode('Sair'));

  for (const el of [quitBttn, quitBttnLabel]) quitBttnContainer.appendChild(el);

  header.appendChild(document.createTextNode('Logout'));

  text.appendChild(document.createTextNode('Deseja realmente sair de Agriland?'));

  for (const el of [header, text, quitBttnContainer]) contentModal.appendChild(el);

  for (const el of [contentModal, closeBttn]) wrapperModal.appendChild(el);

  playerUI.appendChild(wrapperModal);
};

const renderControlls = () => {
  const playerUI = document.getElementById('playerUI');

  const backPlate = genericCreateElement('div', 'back-plate-controll', 'controlls controlls__back-plate');
  const controllContainer = genericCreateElement('div', 'controll-container', 'controlls controlls__container display-flex-column');
  const headerControll = genericCreateElement('p', 'header-controll', 'controlls controlls__header');
  const controlls = genericCreateElement('div', 'controlls', 'controlls controlls__display display-flex-row');
  const leftContainer = genericCreateElement('div', 'left-container-controll', 'controlls controlls__container container--side container__layout display-flex-column');
  const rightContainer = genericCreateElement('div', 'right-container-controll', 'controlls controlls__container container--side display-flex-column');

  headerControll.appendChild(document.createTextNode('COMANDOS'));

  const createControllHelper = (name, content, text) => {
    const variableControll = genericCreateElement('p', `${name}-controll`, `buttons--${name} controlls controlls__buttons display-flex-row`);
    variableControll.appendChild(document.createTextNode(content))
  
    const variableControllLabel = genericCreateElement('p', `${name}-controll-label`, `${name}-controll-label`)

    const variableControllContainer = genericCreateElement('div', `${name}ControllContainer`, `controlls container--${name} controlls__container container__layout display-flex-row`);

    variableControllLabel.appendChild(document.createTextNode(text));

    const variableArrow = genericCreateElement('div', 'arrow', 'controlls controlls__arrow');
    
    for (const el of [variableControll, variableArrow, variableControllLabel]) variableControllContainer.appendChild(el);
    
    return variableControllContainer;
  };

  const upControllContainer = createControllHelper('up', 'W', 'frente');
  const leftControllContainer = createControllHelper('left', 'A', 'esquerda');
  const rightControllContainer = createControllHelper('right', 'D', 'direita');
  const downControllContainer = createControllHelper('down', 'S', 'trás');

  for (const el of [upControllContainer, leftControllContainer, rightControllContainer, downControllContainer]) leftContainer.appendChild(el);

  const cameraControllContainer = createControllHelper('camera', 'V', 'alternar câmera');
  const jumpControllContainer = createControllHelper('jump', 'Barra de Espaço',  'saltar');
  const runControllContainer = createControllHelper('run', 'Shift',  'correr');

  for (const el of [cameraControllContainer, jumpControllContainer, runControllContainer]) rightContainer.appendChild(el);

  for (const el of [leftContainer, rightContainer]) controlls.appendChild(el);
  
  controllContainer.appendChild(controlls);

  for (const el of [headerControll, controllContainer]) backPlate.appendChild(el);

  playerUI.appendChild(backPlate);

  function refreshPosition() {
    const button = document.getElementById('controls-bttn');
    const buttonRect = button.getBoundingClientRect();
    backPlate.style.left =  buttonRect.left - backPlate.offsetWidth + "px";
    backPlate.style.top = buttonRect.top + "px";
  }

  refreshPosition();

  applyPaddingsForTotalHeight('controls-bttn', 'header-controll');

  window.addEventListener("resize", () => refreshPosition('controls-bttn', 'header-controll'));
  window.addEventListener("resize", refreshPosition);
};

const renderTutorial  = () => {
  let playVideo = false;

  const playerUI = document.getElementById('playerUI');
  
  const tutorialActions = genericCreateElement('div', 'tutorial-actions', 'tutorial tutorial__actions display-flex-row');
  
  const maximizeContainer = genericCreateElement('div', 'maximize-container', 'tutorial tutorial__actions actions__maximize display-flex-column');
  const maximizeBttn = genericCreateElement('button', 'maximize-bttn', 'tutorial tutorial__actions actions__maximize maximize__bttn bttn');
  const maximizeLabel = genericCreateElement('p', 'maximize-label', 'tutorial tutorial__actions actions__maximize maximize__label');
  
  const minimizeContainer = genericCreateElement('div', 'minimize-container', 'tutorial tutorial__actions actions__minimize display-flex-column');
  const minimizeBttn = genericCreateElement('button', 'minimize-bttn', 'tutorial tutorial__actions actions__minimize minimize__bttn bttn');
  const minimizeLabel = genericCreateElement('p', 'minimize-label', 'tutorial tutorial__actions actions__minimize minimize__label');
  
  const closeContainer = genericCreateElement('div', 'close-container', 'tutorial tutorial__actions actions__close display-flex-column');
  const closeBttn = genericCreateElement('button', 'close-bttn-video', 'tutorial tutorial__actions actions__close close__bttn bttn');
  const closeLabel = genericCreateElement('p', 'close-label', 'tutorial tutorial__actions actions__close close__label');
  
  const player = genericCreateElement('video', 'player', 'tutorial tutorial__player video__wrapper video');
  const tutorialPlayer = genericCreateElement('div', 'tutorial-player', 'tutorial tutorial__player display-flex-column');
  const tutorialContainer = genericCreateElement('div', 'tutorial-container', 'tutorial tutorial__container container--maximize');
  const playerWrapper = genericCreateElement('div', 'player-wrapper', 'tutorial tutorial__player video__wrapper');
  
  const controlls = genericCreateElement('div', 'player-controlls', 'tutorial tutorial__controlls controlls__container display-flex-column');
  const videoTimer = genericCreateElement('p', 'video-timer', 'tutorial tutorial__controlls controlls__timer');
  const playBttn = genericCreateElement('button', 'play-bttn', 'tutorial tutorial__controlls controlls__play-bttn active');
  
  const progressVideo = genericCreateElement('div', 'progress-video', 'tutorial tutorial__controlls controlls__progress bttn display-flex-row');
  const markProgress = genericCreateElement('div', 'mark-progress', 'tutorial tutorial__controlls controlls__progress progress__mark bttn');
  
  const hoverPlayer = createPlayerHover();
  
  player.src = '../public/video/Video_Tutorial.mp4';
  player.autoplay = true;

  const showPlayBttn = (hiddenBefore, onPlay) => {  
    const hoverPlayer = document.getElementById('hover-player');
    if (!onPlay) hoverPlayer.classList.toggle('active');
    hoverPlayer.style.visibility = 'visible';

    if (hiddenBefore) {
      setTimeout(() => {
        hoverPlayer.style.visibility = 'hidden';
      }, 500)
    }
  }

  playerWrapper.onclick = () => {
    if (playVideo) {
      showPlayBttn(true, true);
      playBttn.className = 'tutorial tutorial__controlls controlls__play-bttn active';
      player.play()
      playVideo = false;
    } else {
      showPlayBttn(false, false);
      playBttn.className = 'tutorial tutorial__controlls controlls__play-bttn';
      player.pause();
      playVideo = true;
    }
  }

  playerWrapper.appendChild(player);
  playerWrapper.appendChild(hoverPlayer);

  player.addEventListener('timeupdate', () => {
    const currentMin = Math.floor(player.currentTime / 60);
    const currentSec = Math.floor(player.currentTime % 60).toString().padStart(2, '0');
    videoTimer.innerHTML = `00:${currentMin.toString().padStart(2, '0')}:${currentSec}`
    markProgress.style.marginLeft = '3';

    const totalTime = player.duration;
    const currentTime = player.currentTime;

    const percentage = (currentTime / totalTime) * 100;

    markProgress.style.marginLeft = `${percentage}%`;

    if (currentTime === totalTime) {
      showPlayBttn(false, false);
      playBttn.className = 'tutorial tutorial__controlls controlls__play-bttn';
      player.currentTime = 0;
      playVideo = true;
    }
  });

  progressVideo.onclick = e => {
    player.pause();
    const progressBar = progressVideo.getBoundingClientRect();
    const clickX = e.clientX - progressBar.left;
    const percentage = (clickX / progressBar.width) * 100;

    document.getElementById('mark-progress').style.marginLeft = `${percentage}%`;

    const newCurrentTime = (player.duration * percentage) / 100;

    player.currentTime = newCurrentTime;

    player.play();
  };

  progressVideo.appendChild(markProgress);
  
  playBttn.onclick = () => {
    if (playVideo) {
      showPlayBttn(true, true);
      playBttn.className = 'tutorial tutorial__controlls controlls__play-bttn active';
      player.play()
      playVideo = false;
    } else {
      showPlayBttn(false, false);
      playBttn.className = 'tutorial tutorial__controlls controlls__play-bttn';
      player.pause();
      hoverPlayer.classList('active');
      playVideo = true;
    }
  };

  videoTimer.appendChild(document.createTextNode('00:00:00'));

  controlls.appendChild(progressVideo);
  controlls.appendChild(playBttn);
  controlls.appendChild(videoTimer);

  tutorialPlayer.appendChild(playerWrapper);
  tutorialPlayer.appendChild(controlls);

  maximizeBttn.onclick = () => {
    tutorialContainer.className = tutorialContainer.className.replace('minimize', 'maximize');

    document.getElementById('tutorial-player').style.height = '95%';
    document.getElementById('progress-video').style.bottom = '148px';
    document.getElementById('play-bttn').style.bottom = '81px';
    document.getElementById('video-timer').style.bottom = '33px';
    
    document.getElementById('play-bttn').style.visibility = 'visible';
    
    tutorialActions.removeChild(closeContainer);
    tutorialActions.removeChild(maximizeContainer);

    tutorialActions.appendChild(minimizeContainer)
    tutorialActions.appendChild(closeContainer)
  }

  maximizeLabel.appendChild(document.createTextNode('Maximizar Player'));

  maximizeContainer.appendChild(maximizeBttn);
  maximizeContainer.appendChild(maximizeLabel);

  minimizeBttn.onclick = () => {
    tutorialContainer.className = tutorialContainer.className.replace('maximize', 'minimize');

    document.getElementById('tutorial-player').style.height = '85%';
    document.getElementById('progress-video').style.bottom = '167px';
    document.getElementById('play-bttn').style.bottom = '100px';
    document.getElementById('video-timer').style.bottom = '52px';

    document.getElementById('play-bttn').style.visibility = 'hidden';

    tutorialContainer.style.top
    
    tutorialActions.appendChild(closeContainer)
    tutorialActions.removeChild(minimizeContainer);
    tutorialActions.appendChild(maximizeContainer)
    tutorialActions.appendChild(closeContainer)
  }

  minimizeLabel.appendChild(document.createTextNode('Reduzir Player'));

  minimizeContainer.appendChild(minimizeBttn);
  minimizeContainer.appendChild(minimizeLabel);

  closeBttn.onclick = () => {
    const helpBttn = document.getElementById('help-bttn');
    helpBttn.className = helpBttn.className.replace(' active', '');
    modalStates["help-bttn"] = true;
    playerUI.removeChild(tutorialContainer)
  };

  closeLabel.appendChild(document.createTextNode('Fechar Player'));

  closeContainer.appendChild(closeBttn);
  closeContainer.appendChild(closeLabel);

  tutorialActions.appendChild(minimizeContainer);
  tutorialActions.appendChild(closeContainer);

  tutorialContainer.appendChild(tutorialPlayer);
  tutorialContainer.appendChild(tutorialActions);

  playerUI.appendChild(tutorialContainer);
};

const renderRPM  = () => {
  const iframeContainer = genericCreateElement('div', 'iframe-container', 'rpm rpm__container display-flex-row');
  const iframe = genericCreateElement('iframe', 'rpm-iframe', 'rpm rpm__iframe');
  const closeIframe = genericCreateElement('button', 'close-frame-bttn', 'rpm rpm__close bttn');

  iframe.src = 'https://agriland.readyplayer.me/avatar?frameApi&bodyType=fullbody';
  iframe.sandbox= "allow-forms allow-scripts allow-same-origin";
  iframe.allow= "camera; microphone; geolocation; autoplay; fullscreen; encrypted-media; picture-in-picture";
  
  closeIframe.appendChild(document.createTextNode('X'));
  closeIframe.onclick = () => {
    modalStates['avatar-bttn'] = true;
    const playerUI = document.getElementById('playerUI');
    playerUI.removeChild(iframeContainer);
  };
  
  iframeContainer.appendChild(closeIframe);
  iframeContainer.appendChild(iframe)
  
  playerUI.appendChild(iframeContainer);
  window.addEventListener('message', subscribe);
  document.addEventListener('message', subscribe);
}

const renderSchedule = async data => {
  const playerUI = document.getElementById('playerUI');
  
  const scheduleContainer = genericCreateElement('div', 'schedule-container', 'schedule schedule__container  display-flex-column');
  const backPlate = genericCreateElement('div', 'back-plate-schedule', 'schedule schedule__back-plate');
  const headerModal = genericCreateElement('p', 'header-modal-schedule', 'schedule schedule__header');
  const wrapperRow = genericCreateElement('div', 'wrapper-row', 'schedule schedule__row row__wrapper display-flex-column');
  
  headerModal.appendChild(document.createTextNode('AGENDA'));

  scheduleContainer.appendChild(headerModal);

  const loading = circleLoadder();

  scheduleContainer.appendChild(loading);

  function refreshPosition() {
    const button = document.getElementById('schedule-bttn');
    const buttonRect = button.getBoundingClientRect();
    backPlate.style.left =  buttonRect.left - backPlate.offsetWidth + "px";
    backPlate.style.top = buttonRect.top + "px";
  }

  backPlate.appendChild(scheduleContainer);
  
  window.addEventListener("resize", refreshPosition);
  
  playerUI.appendChild(backPlate);

  applyPaddingsForTotalHeight('schedule-bttn', 'header-modal-schedule');

  window.addEventListener("resize", () => refreshPosition('schedule-bttn', 'header-modal-schedule'));
  
  refreshPosition()

  const list = await fetchList();

  if (list.length > 0) {
    for (let [index, el] of [...list, ...list, ...list].entries()) {
      const formatDate = () => {
        const hour = `${String(el.startAt.hour).padStart(2, '0')}:${String(el.startAt.minute).padStart(2, '0')}`

        if (String(el.startAt.year).length === 4) return `${String(el.startAt.day).padStart(2, '0')}/${String(el.startAt.month).padStart(2, '0')}/${el.startAt.year} ${hour}`;
        return `${String(el.startAt.year).padStart(2, '0')}/${String(el.startAt.month).padStart(2, '0')}/${el.startAt.day} ${hour}`;
      }

      const startAtContent = formatDate();
      const eventMoment = `${startAtContent}`;
      const eventName = el.eventName;
      const eventPlace = el.placeName;
  
      const row = genericCreateElement('div', 'row-schedule', `schedule schedule__row ${index % 2 === 0 ? 'grey' : ''} display-flex-column`);
      const rowInfos = genericCreateElement('div', 'row-infos-schedule', 'schedule schedule__row row__infos display-flex-row');
      const eventPlaceText = genericCreateElement('p', 'event-place-text', 'event-place-text schedule schedule__row row__infos ');
      const eventMomentText = genericCreateElement('p', 'event-moment-text', 'schedule schedule__row row__time');
      const eventNameElement = genericCreateElement('div', 'event-name-text', 'event-name-text');
      
      eventPlaceText.appendChild(document.createTextNode(eventPlace));
      eventNameElement.appendChild(document.createTextNode(eventName));
      eventMomentText.appendChild(document.createTextNode(eventMoment));
  
      rowInfos.appendChild(eventPlaceText);
      rowInfos.appendChild(eventMomentText);
      
      row.appendChild(eventNameElement);
      row.appendChild(rowInfos);
  
      wrapperRow.appendChild(row);
    }
  } else {
    const notFoundText = genericCreateElement('p', 'not-fount-text', 'not-fount-text');
    notFoundText.appendChild(document.createTextNode('Não foram encontrados eventos.'));

    wrapperRow.appendChild(notFoundText)
  }

  scheduleContainer.removeChild(loading);

  scheduleContainer.appendChild(wrapperRow);
}

const renderChat = (chatNameText) => {
  const playerUI = document.getElementById('playerUI');
  const chatBttn = document.getElementById('chat-bttn');

  const displayChat = genericCreateElement('div', 'display-chat', 'chat chat__screen');
  const closeChat = genericCreateElement('button', 'close-chat-bttn', 'chat chat__bttn-close bttn');
  const inputChat = genericCreateElement('input', 'input-chat', 'chat chat__input');
  const chatContainer = genericCreateElement('div', 'container-chat', 'chat chat__container');

  inputChat.placeholder = "Pressione 'Enter' para interagir com o chat";
  
  closeChat.appendChild(document.createTextNode(''));


  closeChat.onclick = () => {
    chatBttn.style.visibility = 'visible';
    playerUI.removeChild(chatContainer);
  };

  const chatName = genericCreateElement('p', 'chat-name', 'chat chat__title display-flex-row');
  chatName.appendChild(document.createTextNode(`Chat ${chatNameText}`));

  for (const el of [chatName, closeChat, displayChat, inputChat]) chatContainer.appendChild(el); 

  inputChat.addEventListener('keydown', event => {
    if (event.keyCode === 13) {
      const value = inputChat.value;

      if (value !== '') {
        const user = genericCreateElement('p', 'user-message', 'chat chat__message chat__message--user');
        const message = genericCreateElement('p', 'text-message', 'text-message');
        const messageContainer = genericCreateElement('div', 'message-container', 'chat chat__message');
        
        user.appendChild(document.createTextNode(`${userData.userData.name} ${userData.userData.lastName}:`));
  
        message.appendChild(document.createTextNode(`${value}`));
        
        messageContainer.appendChild(user);
        messageContainer.appendChild(message);
  
        displayChat.appendChild(messageContainer);
  
        inputChat.value = '';
  
        displayChat.scrollTop = displayChat.scrollHeight;
  
        emitUIInteraction({  })
      }
    }
  });

  chatBttn.style.visibility = 'hidden';
  playerUI.appendChild(chatContainer);
};

const renderHud = () => {
  const playerUI = document.getElementById('playerUI');

  const sideLeftBar = genericCreateElement('div', '', 'hud-container hud-container--left display-flex-column');
  const topSideBar = genericCreateElement('div', 'top-side-bar', 'hud-container hud-container--top display-flex-column');
  
  const chatBttn = createButton(
    'chat-bttn',
    'bttn bttn--little bttn__chat',
    () => {
      if (modalStates['chat-bttn']) {
        modalStates['chat-bttn'] - false;
        renderChat('local');
      } else {
        modalStates['chat-bttn'] - true;
        const playerUI = document.getElementById('playerUI');
        playerUI.removeChild(document.getElementById('container-chat'))
      }
    }
  )
  
  const helpBttn = createButton(
    'help-bttn',
    'bttn bttn--middle bttn__help',
    () => {
      if (modalStates['help-bttn']) {
        modalStates['help-bttn'] = false;
        renderTutorial();
      } else {
        modalStates['help-bttn'] = true;
        const playerUI = document.getElementById('playerUI');
        const helpContainer = document.getElementById('tutorial-container');
        playerUI.removeChild(helpContainer);
      }
    }
  );

  const buttons = [ 
    {
      id: 'avatar-bttn',
      className: 'bttn bttn--larger bttn-avatar',
      onClick: () => {
        if (modalStates['avatar-bttn']) {
          modalStates['avatar-bttn'] = false;
          renderRPM();
        } else {
          modalStates['avatar-bttn'] = true;
          const playerUI = document.getElementById('playerUI');
          const iframeContainer = document.getElementById('iframe-container');
          playerUI.removeChild(iframeContainer);
        }
      }
    },
    {
      id: 'map-bttn',
      className: 'bttn bttn--larger bttn__map',
      onClick: () => {
        console.log('openMap');
      }
    },
    {
      id: 'schedule-bttn',
      className: 'bttn bttn--small bttn__schedule',
      onClick: () => {
        if (modalStates['schedule-bttn']) {
          modalStates['schedule-bttn'] = false;
          renderSchedule();
        } else {
          modalStates['schedule-bttn'] = true;
          const playerUI = document.getElementById('playerUI');
          playerUI.removeChild(document.getElementById('back-plate-schedule'));
        }
      }
    },
    {
      id: 'controls-bttn',
      className: 'bttn bttn--small bttn__controlls',
      onClick: () => {
        if (modalStates['controls-bttn']) {
          modalStates['controls-bttn'] = false;
          renderControlls();
        }
        else {
          modalStates['controls-bttn'] = true;
          const playerUI = document.getElementById('playerUI');
          playerUI.removeChild(document.getElementById('back-plate-controll'));
        } 
      }
    },
    {
      id: 'sound-bttn',
      className: 'bttn bttn--small bttn__sound',
      onClick: () => console.log('sound')
    },
    {
      id: 'logout-bttn',
      className: 'bttn bttn--small bttn__logout',
      onClick: () => {
        if (modalStates['logout-bttn']) {
          modalStates['logout-bttn'] = false;
          renderQuit();
        } else {
          modalStates['logout-bttn'] = true;
          const playerUI = document.getElementById('playerUI');
          playerUI.removeChild(document.getElementById('wrapper-modal-quit'))
        }
      }
    },
  ];
  
  buttons.forEach(value => {
    if (['avatar-bttn', 'map-bttn', 'schedule-bttn', 'controls-bttn', 'sound-bttn', 'logout-bttn'].includes(value.id))
      topSideBar.appendChild(createButton(value.id, value.className, value.onClick));
  });

  for (let el of [topSideBar, chatBttn]) sideLeftBar.appendChild(el);
  
  const hudElements = [helpBttn, sideLeftBar];

  const hudContainer = genericCreateElement('div', 'hud-container', 'hud-container display-flex-row');

  for (let hudElement of hudElements) hudContainer.appendChild(hudElement);

  playerUI.appendChild(hudContainer);

  if (userData.rpmLink) {
    const avatarBttn = document.getElementById('avatar-bttn');
    if (avatarBttn) avatarBttn.style.backgroundImage = `url("${(userData.rpmLink).replace('.glb', '.png')}")`;
  }
};

const render = () => {
  const dividerTop = createDivider('divider divider-top');
  const dividerFooter = createDivider('divider-footer');
  const dividerBottom = createDivider('divider divider-bottom');
  const buttonSubmit = createButtonWithText("button-signin", onSubmit, "ENTRAR");
  const buttonRegister = createButtonWithText("login actions", () => window.location.replace("register.html"), "Cadastre-se");
  const buttonForget = createButtonWithText("login actions", () => window.location.replace("forget.html"), "Esqueceu sua senha?");
  const card = genericCreateElement("div", "card-login", "card-login display-flex-column");
  const footerCard = genericCreateElement("div", "footer-login", "footer-login display-flex-row");
  const submitContainer = genericCreateElement("div", "submit-container", "submit-container");
  const title = createTitle("Login");
  const emailInput = createInput("email", "login input-data display-flex-column", "Usuário", "email");
  const passwordInput = createInput("password", "login input-data display-flex-column", "Senha", "password");
  const alert = genericCreateElement("div", 'alert', '');

  // const baseUrl = "http://localhost:3090";
  
  const appendChilds = (father, childs) => childs.forEach(value => father.appendChild(value));

  const root = document.getElementById('root');

  const playerUI = document.getElementById('playerUI');

  playerUI.style.visibility = 'hidden';

  // teste = false;

  submitContainer.appendChild(buttonSubmit);

  appendChilds(footerCard, [buttonRegister, dividerFooter, buttonForget]);

  appendChilds(card, [
    title,
    dividerTop,
    emailInput,
    passwordInput,
    submitContainer,
    dividerBottom,    
    footerCard,
    alert,
  ]);

  root.appendChild(card);

  root.style.position = 'absolute';
  root.style.zIndex = "1";
};
// End Renders Sections

document.addEventListener("DOMContentLoaded", () => render());