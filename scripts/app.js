let userData;
let helpInactive = true;
let controllInactive = true;
let logoutInactive = true;
let scheduleInactive = true;

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

const renderQuit = () => {
  const playerUI = document.getElementById('playerUI');

  const closeBttn = document.createElement('button');
  closeBttn.id = 'close-bttn-quit';
  closeBttn.className = 'close-bttn-quit bttn';
  closeBttn.appendChild(document.createTextNode('X'));
  closeBttn.onclick = () => {
    logoutInactive = true;
    playerUI.removeChild(document.getElementById('wrapper-modal-quit'))
  };

  const quitBttn = document.createElement('button');
  quitBttn.id = 'quit-bttn';
  quitBttn.className = 'quit-bttn bttn';

  const quitBttnLabel = document.createElement('p');
  quitBttnLabel.id = 'quit-bttn-label';
  quitBttnLabel.className = 'quit-bttn-label';
  quitBttnLabel.appendChild(document.createTextNode('Sair'));

  const quitBttnContainer = document.createElement('div');
  quitBttnContainer.id = 'quit-bttn-container';
  quitBttnContainer.className = 'quit-bttn-container';

  for (const el of [quitBttn, quitBttnLabel]) quitBttnContainer.appendChild(el);

  const header = document.createElement('p');
  header.id = 'header-quit';
  header.className = 'header-quit';
  header.appendChild(document.createTextNode('Logout'));

  const text = document.createElement('p');
  text.id = 'text-quit';
  text.className = 'text-quit';
  text.appendChild(document.createTextNode('Deseja realmente sair de Agriland?'));

  const contentModal = document.createElement('div');
  contentModal.id = 'content-modal-quit';
  contentModal.className = 'content-modal-quit';

  const wrapperModal = document.createElement('div');
  wrapperModal.id = 'wrapper-modal-quit';
  wrapperModal.className = 'wrapper-modal-quit';

  for (const el of [header, text, quitBttnContainer]) contentModal.appendChild(el);

  for (const el of [contentModal, closeBttn]) wrapperModal.appendChild(el);

  playerUI.appendChild(wrapperModal);
};

const renderControlls = () => {
  const playerUI = document.getElementById('playerUI');

  const controllContainer = document.createElement('div');
  controllContainer.id = 'controll-container';
  controllContainer.className = 'controll-container';

  const headerControll = document.createElement('p');
  headerControll.id = 'header-controll';
  headerControll.className = 'header-controll';
  headerControll.appendChild(document.createTextNode('COMANDOS'));

  const controlls = document.createElement('div');
  controlls.id = 'controlls';
  controlls.className = 'controlls';

  
  const createControllHelper = (name, content, text) => {
    const variableControll = document.createElement('p');
    variableControll.id = `${name}-controll`;
    variableControll.className = `${name}-controll button-controll`;
    variableControll.appendChild(document.createTextNode(content))
  
    const variableControllLabel = document.createElement('p');
    variableControllLabel.id = `${name}-controll-label`;
    variableControllLabel.className = `${name}-controll-label`;
    
    const variableControllContainer = document.createElement('div');
    variableControllContainer.id = `${name}ControllContainer`;
    variableControllContainer.className = `${name}-controll-container layout-controll-container`;

    variableControllLabel.appendChild(document.createTextNode(text));

    const variableArrow = document.createElement('div');
    variableArrow.id = 'arrow';
    variableArrow.className = 'arrow';
    
    variableControllContainer.appendChild(variableControll);
    variableControllContainer.appendChild(variableArrow);
    variableControllContainer.appendChild(variableControllLabel);
    
    return variableControllContainer;
  };

  const upControllContainer = createControllHelper('up', 'W', 'frente');
  const leftControllContainer = createControllHelper('left', 'A', 'esquerda');
  const rightControllContainer = createControllHelper('right', 'D', 'direita');
  const downControllContainer = createControllHelper('down', 'S', 'trás');
  const cameraControllContainer = createControllHelper('camera', 'V', 'alternar câmera');
  const jumpControllContainer = createControllHelper('jump', 'Barra de Espaço',  'saltar');
  const runControllContainer = createControllHelper('run', 'Shift',  'correr');

  const leftContainer = document.createElement('div');
  leftContainer.id = 'left-container-controll';
  leftContainer.className = 'left-container-controll side-container-controll';

  for (const el of [upControllContainer, leftControllContainer, rightControllContainer, downControllContainer]) leftContainer.appendChild(el);

  const rightContainer = document.createElement('div');
  rightContainer.id = 'right-container-controll';
  rightContainer.className = 'right-container-controll side-container-controll';

  for (const el of [cameraControllContainer, jumpControllContainer, runControllContainer]) rightContainer.appendChild(el);

  for (const el of [leftContainer, rightContainer]) controlls.appendChild(el);
  
  for (const el of [headerControll, controlls]) controllContainer.appendChild(el);

  playerUI.appendChild(controllContainer);
};

const renderTutorial  = () => {
  let playVideo = false;
  const controlls = document.createElement('div');
  const progressVideo = document.createElement('div');
  const playerUI = document.getElementById('playerUI');
  const markProgress = document.createElement('div');
  const playBttn = document.createElement('button');
  const tutorialPlayer = document.createElement('div');
  const player = document.createElement('video');
  const tutorialContainer = document.createElement('div');
  const videoTimer = document.createElement('p');
  const tutorialActions = document.createElement('div');
  const maximizeContainer = document.createElement('div');
  const minimizeContainer = document.createElement('div');
  const closeContainer = document.createElement('div');
  const maximizeBttn = document.createElement('button');
  const maximizeLabel = document.createElement('p');
  const minimizeBttn = document.createElement('button');
  const minimizeLabel = document.createElement('p');
  const closeBttn = document.createElement('button');
  const closeLabel = document.createElement('p');
  const playerWrapper = document.createElement('div');
  
  tutorialContainer.id = 'tutorial-container';
  tutorialContainer.className = 'tutorial-container';
  
  tutorialPlayer.id = 'tutorial-player';
  tutorialPlayer.className = 'tutorial-player';
  
  player.src = './video/Video_Tutorial.mp4';
  player.id = 'player';
  player.className = 'player bttn';
  player.autoplay = true;

  playerWrapper.id = 'player-wrapper';
  playerWrapper.className = 'player-wrapper';
  playerWrapper.onclick = () => {
    if (playVideo) {
      playBttn.className = 'play-bttn bttn active';
      player.play()
      playVideo = false;
    } else {
      playBttn.className = 'play-bttn bttn';
      player.pause();
      playVideo = true;
    }
  }
  playerWrapper.appendChild(player);

  player.addEventListener('timeupdate', () => {
    const currentMinutos = Math.floor(player.currentTime / 60);
    const currentSegundos = Math.floor(player.currentTime % 60).toString().padStart(2, '0');
    document.getElementById('video-timer').innerHTML = `00:${currentMinutos.toString().padStart(2, '0')}:${currentSegundos}`
    document.getElementById('mark-progress').style.marginLeft = '3';

    const duracaoTotal = player.duration;
    const tempoAtual = player.currentTime;

    const porcentagemCompleta = (tempoAtual / duracaoTotal) * 100;

    document.getElementById('mark-progress').style.marginLeft = `${porcentagemCompleta}%`;

    if (tempoAtual === duracaoTotal) {
      playBttn.className = 'play-bttn bttn';
      player.currentTime = 0;
      playVideo = true;
    }
  });

  controlls.id = 'player-controlls';
  controlls.className = 'player-controlls';
    
  progressVideo.id = 'progress-video';
  progressVideo.className = 'progress-video bttn';
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

  markProgress.id = 'mark-progress';
  markProgress.className = 'mark-progress bttn';

  progressVideo.appendChild(markProgress);
  
  playBttn.id = 'play-bttn';
  playBttn.className = 'play-bttn bttn active';
  playBttn.onclick = () => {
    if (playVideo) {
      playBttn.className = 'play-bttn bttn active';
      player.play()
      playVideo = false;
    } else {
      playBttn.className = 'play-bttn bttn';
      player.pause();
      playVideo = true;
    }
  };

  videoTimer.id = 'video-timer';
  videoTimer.className = 'video-timer';
  videoTimer.appendChild(document.createTextNode('00:00:00'));

  controlls.appendChild(progressVideo);
  controlls.appendChild(playBttn);
  controlls.appendChild(videoTimer);

  tutorialPlayer.appendChild(playerWrapper);
  tutorialPlayer.appendChild(controlls);

  tutorialActions.id = 'tutorial-actions';
  tutorialActions.className = 'tutorial-actions';

  maximizeContainer.id = 'minimize-container';
  maximizeContainer.className = 'minimize-container';

  maximizeBttn.id = 'maximize-bttn';
  maximizeBttn.className = 'maximize-bttn bttn';
  maximizeBttn.onclick = () => {
    tutorialContainer.style.width = '70%';
    tutorialContainer.style.height = '90%';
    tutorialContainer.style.top = '50%';
    tutorialContainer.style.left = '50%';
    tutorialContainer.style.transform = 'translate(-50%, -50%)';

    document.getElementById('tutorial-player').style.height = '95%';
    document.getElementById('progress-video').style.bottom = '148px';
    document.getElementById('play-bttn').style.bottom = '81px';
    document.getElementById('video-timer').style.bottom = '33px';
    
    tutorialActions.removeChild(closeContainer);
    tutorialActions.removeChild(maximizeContainer);

    tutorialActions.appendChild(minimizeContainer)
    tutorialActions.appendChild(closeContainer)
  }

  maximizeLabel.id = 'maximize-label';
  maximizeLabel.className = 'maximize-label';
  maximizeLabel.appendChild(document.createTextNode('Maximizar Player'));

  maximizeContainer.appendChild(maximizeBttn);
  maximizeContainer.appendChild(maximizeLabel);

  minimizeContainer.id = 'minimize-container';
  minimizeContainer.className = 'minimize-container';
 
  minimizeBttn.id = 'minimize-bttn';
  minimizeBttn.className = 'minimize-bttn bttn';
  minimizeBttn.onclick = () => {
    tutorialContainer.style.width = '20%';
    tutorialContainer.style.height = '40%';
    tutorialContainer.style.top = '30%';
    tutorialContainer.style.left = '15%';

    document.getElementById('tutorial-player').style.height = '85%';
    document.getElementById('progress-video').style.bottom = '167px';
    document.getElementById('play-bttn').style.bottom = '100px';
    document.getElementById('video-timer').style.bottom = '52px';

    tutorialContainer.style.top
    
    tutorialActions.appendChild(closeContainer)
    tutorialActions.removeChild(minimizeContainer);
    tutorialActions.appendChild(maximizeContainer)
    tutorialActions.appendChild(closeContainer)
  }
 
  minimizeLabel.id = 'minimize-label';
  minimizeLabel.className = 'minimize-label';
  minimizeLabel.appendChild(document.createTextNode('Reduzir Player'));

  minimizeContainer.appendChild(minimizeBttn);
  minimizeContainer.appendChild(minimizeLabel);
  
  closeContainer.id = 'close-container';
  closeContainer.className = 'close-container';
 
  closeBttn.id = 'close-bttn-video';
  closeBttn.className = 'close-bttn-video bttn';
  closeBttn.onclick = () => {
    const helpBttn = document.getElementById('help-bttn');
    helpBttn.className = helpBttn.className.replace(' active', '');
    helpInactive = true;
    playerUI.removeChild(tutorialContainer)
  };

  closeLabel.id = 'close-label';
  closeLabel.className = 'close-label';
  closeLabel.appendChild(document.createTextNode('Fechar Player'));

  closeContainer.appendChild(closeBttn);
  closeContainer.appendChild(closeLabel);

  tutorialActions.appendChild(minimizeContainer);
  tutorialActions.appendChild(closeContainer);

  tutorialContainer.appendChild(tutorialPlayer);
  tutorialContainer.appendChild(tutorialActions);

  playerUI.appendChild(tutorialContainer);
};

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

const renderRPM  = () => {
  const iframeContainer = document.createElement('div');
  const iframe = document.createElement('iframe')

  iframeContainer.id = 'iframe-container';
  iframeContainer.className = 'iframe-container';
  
  iframe.src = 'https://agriland.readyplayer.me/avatar?frameApi&bodyType=fullbody';
  iframe.id = 'rpm-iframe';
  iframe.className ='rpm-iframe'
  iframe.sandbox= "allow-forms allow-scripts allow-same-origin";
  iframe.allow= "camera; microphone; geolocation; autoplay; fullscreen; encrypted-media; picture-in-picture";
  
  const closeIframe = document.createElement('button');
  closeIframe.appendChild(document.createTextNode('X'));
  closeIframe.onclick = () => playerUI.removeChild(iframeContainer);
  closeIframe.id = 'close-frame-bttn';
  closeIframe.className = 'close-frame-bttn bttn'
  
  iframeContainer.appendChild(closeIframe);
  iframeContainer.appendChild(iframe)
  
  playerUI.appendChild(iframeContainer);
  window.addEventListener('message', subscribe);
  document.addEventListener('message', subscribe);
}

const serverLogin = () => {
  const root = document.getElementById('root');
  const playerUI = document.getElementById('playerUI');

  root.style.display = "none";
  playerUI.style.visibility = "visible";
}

const renderSchedule = async data => {
  const headerModal = document.createElement('p');
  headerModal.id = 'header-modal-schedule';
  headerModal.className = 'header-modal-schedule';
  headerModal.appendChild(document.createTextNode('AGENDA'));

  const playerUI = document.getElementById('playerUI');
  const scheduleContainer = document.createElement('div');

  scheduleContainer.id = 'schedule-container';
  scheduleContainer.className = 'schedule-container';

  scheduleContainer.appendChild(headerModal);

  const loading = circleLoadder();

  scheduleContainer.appendChild(loading);

  const backPlate = document.createElement('div');
  backPlate.id = 'back-plate-schedule';
  backPlate.className = 'back-plate-schedule';

  backPlate.appendChild(scheduleContainer);

  playerUI.appendChild(backPlate);

  const list = await fetchList();

  const wrapperRow = document.createElement('div');
  wrapperRow.id = 'wrapper-row';
  wrapperRow.className = 'wrapper-row';

  if (list.length > 0) {
    for (let el of list) {
      const startAtContent = `${el.startAt.year}/${el.startAt.month}/${el.startAt.day} ${el.startAt.hour}:${el.startAt.minute}`;
      const endAtContent = `${el.endAt.year}/${el.endAt.month}/${el.endAt.day} ${el.endAt.hour}:${el.endAt.minute}`;
      const eventMoment = `${startAtContent} | ${endAtContent}`;
      const eventName = el.eventName;
      const eventPlace = el.placeName;
  
      const row = document.createElement('div');
      row.id = 'row-schedule';
      row.className = 'row-schedule';
  
      const rowHeader = document.createElement('p');
      rowHeader.id = 'row-header-schedule';
      rowHeader.className = 'row-header-schedule';
      rowHeader.appendChild(document.createTextNode(eventName));
  
      const rowInfos = document.createElement('div');
      rowInfos.id = 'row-infos-schedule';
      rowInfos.className = 'row-infos-schedule';
  
      const eventPlaceText = document.createElement('p');
      eventPlaceText.id = 'event-place-text';
      eventPlaceText.className = 'event-place-text';
      eventPlaceText.appendChild(document.createTextNode(eventPlace));
  
      const eventMomentText = document.createElement('p');
      eventMomentText.id = 'event-moment-text';
      eventMomentText.className = 'event-moment-text';
      eventMomentText.appendChild(document.createTextNode(eventMoment))
  
      rowInfos.appendChild(eventPlaceText);
      rowInfos.appendChild(eventMomentText);
  
      row.appendChild(rowHeader);
      row.appendChild(rowInfos);
  
      wrapperRow.appendChild(row);
    }
  } else {
    const notFoundText = document.createElement('p');
    notFoundText.appendChild(document.createTextNode('Não foram encontrados eventos.'));
    notFoundText.id = 'not-found-text';
    notFoundText.className = 'not-found-text';


    wrapperRow.appendChild(notFoundText)
  }


  scheduleContainer.removeChild(loading);

  scheduleContainer.appendChild(wrapperRow);
}

const renderChat = (chatNameText) => {
  const playerUI = document.getElementById('playerUI');
  const chatBttn = document.getElementById('chat-bttn');

  const displayChat = document.createElement('div');
  displayChat.id = 'display-chat';
  displayChat.className = 'display-chat';

  const inputChat = document.createElement('input');
  inputChat.id = 'input-chat';
  inputChat.className = 'input-chat';
  inputChat.placeholder = "Pressione 'Enter' para interagir com o chat";
  
  const closeChat = document.createElement('button');
  closeChat.id = 'close-chat-bttn';
  closeChat.className = 'close-chat-bttn bttn';
  closeChat.appendChild(document.createTextNode(''));

  const chatContainer = document.createElement('div');
  chatContainer.id = 'container-chat';
  chatContainer.className = 'container-chat';

  closeChat.onclick = () => {
    chatBttn.style.visibility = 'visible';
    playerUI.removeChild(chatContainer);
  };

  const chatName = document.createElement('p');
  chatName.id = 'chat-name';
  chatName.className = 'chat-name';
  chatName.appendChild(document.createTextNode(`Chat ${chatNameText}`));

  chatContainer.appendChild(chatName);
  chatContainer.appendChild(closeChat);
  chatContainer.appendChild(displayChat);
  chatContainer.appendChild(inputChat);

  inputChat.addEventListener('keydown', event => {
    if (event.keyCode === 13) {
      const value = inputChat.value;

      if (value !== '') {
        const user = document.createElement('p');
        user.appendChild(document.createTextNode(`${userData.userData.name} ${userData.userData.lastName}:`));
        user.id = 'user-message';
        user.className = 'user-message';
  
        const message = document.createElement('p');
        message.appendChild(document.createTextNode(`${value}`));
        message.id = 'text-message';
        message.className = 'text-message';
  
        const messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        messageContainer.className = 'message-container';
  
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

  const baseUrl = "https://admin-brasilagriland.com.br/hub/auth/schedule";

  const createButton = (id, className, onClick, content) => {
    let activeBttn = true;
    const button = document.createElement('button');
    button.className = className;
    button.id = id;

    button.onclick = () => {
      button.className = `${className}${activeBttn ? ' active' : ''}`
      activeBttn = !activeBttn;
      onClick();
    };

    button.appendChild(document.createTextNode(content));

    return button;
  };

  const emit = name => emitUIInteraction({ name });

  const scheduleBttn = createButton(
    'schedule-bttn',
    'schedule-bttn bttn',
    () => {
      if (scheduleInactive) {
        scheduleInactive = false;
        renderSchedule();
      } else {
        scheduleInactive = true;
        const playerUI = document.getElementById('playerUI');
        playerUI.removeChild(document.getElementById('back-plate-schedule'));
      }
    },
    ''
  );

  const helpBttn = createButton(
    'help-bttn',
    'help-bttn bttn',
    () => {
      if (helpInactive) {
        helpInactive = false;
        renderTutorial();
      } else {
        helpInactive = true;
        const helpContainer = document.getElementById('tutorial-container');
        playerUI.removeChild(helpContainer);
      }
    },
    ''
  );

  const avatarBttn = createButton(
    'avatar-bttn',
    'avatar-bttn bttn',
    renderRPM,
    ''
  );

  if (userData.rpmLink) avatarBttn.style.backgroundImage = `url("${(userData.rpmLink).replace('.glb', '.png')}")`;

  const mapBttn = createButton(
    'map-bttn',
    'map-bttn bttn',
    () => {
      emit('openMap');
    },
    ''
  );

  const controlsBttn = createButton(
    'controls-bttn',
    'controls-bttn bttn',
    () => {
      if (controllInactive) {
        controllInactive = false;
        renderControlls();
      }
      else {
        controllInactive = true;
        const playerUI = document.getElementById('playerUI');
        playerUI.removeChild(document.getElementById('controll-container'));
      } 
    },
    ''
  );

  const soundBttn = createButton(
    'sound-bttn',
    'sound-bttn bttn',
    () => emit('sound'),
    ''
  );

  const logoutBttn = createButton(
    'logout-bttn',
    'logout-bttn bttn',
    () => {
      if (logoutInactive) {
        logoutInactive = false;
        renderQuit();
      } else {
        logoutInactive = true;
        const playerUi = document.getElementById('playerUI');
        playerUI.removeChild(document.getElementById('wrapper-modal-quit'))
      }
    },
    ''
  );

  const chatBttn = createButton(
    'chat-bttn',
    'chat-bttn bttn',
    () => {
      renderChat('local');
    },
    ''
  );

  const sideLeftBar = document.createElement('div');
  sideLeftBar.className ='side-left-bar';

  const topSideBar = document.createElement('div');
  topSideBar.className = 'top-side-bar';

  const topSideBarElements = [
    avatarBttn,
    mapBttn,
    scheduleBttn,
    controlsBttn,
    soundBttn,
    logoutBttn,
  ]

  for (let el of topSideBarElements) topSideBar.appendChild(el);

  for (let el of [topSideBar, chatBttn]) sideLeftBar.appendChild(el);
  
  const hudElements = [sideLeftBar, helpBttn];

  for (let hudElement of hudElements) playerUI.appendChild(hudElement);
};

const render = () => {
  const loading = () => {
    const mother = document.createElement("div");
    mother.id = "loading";
    mother.className = "lds-ellipsis";

    const one = document.createElement("div");
    const two = document.createElement("div");
    const three = document.createElement("div");
    const four = document.createElement("div");

    mother.appendChild(one);
    mother.appendChild(two);
    mother.appendChild(three);
    mother.appendChild(four);

    return mother;
  }

  const createDivider = (className) => {
    const div = document.createElement("div");

    div.className = className;

    return div;
  };

  const baseUrl = "https://admin-brasilagriland.com.br/services";
  // const baseUrl = "http://localhost:3090";
  
  const createInput = (id, className, labelText, type) => {
    const input = document.createElement("input");
    const label = document.createElement("label");
    
    input.id = id;
    input.type = type;
    
    label.for = id;
    
    label.appendChild(document.createTextNode(labelText));
  
    const div = document.createElement("div");

    div.className = className;
      
    div.appendChild(label);
    div.appendChild(input);
  
    return div;
  };

  const createButton = (className, onClick, buttonText) => {
    const button = document.createElement("button");
    button.appendChild(document.createTextNode(buttonText));
  
    button.className = className;

    button.id = className;
  
    button.onclick = onClick;
  
    return button;
  }

  const createTitle = (text) => {
    const title = document.createElement("h1");
    title.style.color = "#dcdc01";
    title.appendChild(document.createTextNode(text));
    return title;
  };

  const appendChilds = (father, childs) => childs.forEach(value => father.appendChild(value));

  const root = document.getElementById('root');

  const playerUI = document.getElementById('playerUI');

  playerUI.style.visibility = 'hidden';

  const title = createTitle("Login");

  const emailInput = createInput("email", "email-input", "Usuário", "email");

  const passwordInput = createInput("password", "password-input", "Senha", "password");

  const alert = document.createElement("div");
  alert.id = "alert";

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

  // teste = false;

  const dividerTop = createDivider('divider divider-top');

  const dividerFooter = createDivider('divider-footer');
  
  const dividerBottom = createDivider('divider divider-bottom');
   
  const buttonSubmit = createButton("button-signin", onSubmit, "ENTRAR");

  const buttonRegister = createButton("button-register", () => window.location.replace("register.html"), "Cadastre-se");

  const buttonForget = createButton("button-forget", () => window.location.replace("forget.html"), "Esqueceu sua senha?");

  const card = document.createElement("div");
  
  card.className = "card-login";

  card.id = "card-login";

  const footerCard = document.createElement("div");

  footerCard.className = "footer-login";

  const submitContainer = document.createElement("div");
  submitContainer.id = "submit-container";
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

document.addEventListener("DOMContentLoaded", () => render());


