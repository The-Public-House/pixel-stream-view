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
const genericCreateElement = (type, id, className) => {
  const element = document.createElement(type)
  element.className = className;
  element.id = id;

  return element;
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

  const closeBttn = genericCreateElement('button', 'close-bttn-quit', 'close-bttn-quit bttn');
  const quitBttn = genericCreateElement('button', 'quit-bttn', 'quit-bttn bttn');
  const quitBttnLabel = genericCreateElement('p', 'quit-bttn-label', 'quit-bttn-label');
  const quitBttnContainer = genericCreateElement('div', 'quit-bttn-container', 'quit-bttn-container')
  const header = genericCreateElement('p', 'header-quit', 'header-quit');
  const text = genericCreateElement('p', 'text-quit', 'text-quit');
  const contentModal = genericCreateElement('div', 'content-modal-quit', 'content-modal-quit');
  const wrapperModal = genericCreateElement('div', 'wrapper-modal-quit', 'wrapper-modal-quit');

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
    console.log(modalStates);
    console.log(MODAL_STATES_INITIAL);
    
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

  const backPlate = genericCreateElement('div', 'back-plate-controll', 'back-plate-controll');
  const controllContainer = genericCreateElement('div', 'controll-container', 'controll-container');
  const headerControll = genericCreateElement('p', 'header-controll', 'header-controll');
  const controlls = genericCreateElement('div', 'controlls', 'controlls');
  const leftContainer = genericCreateElement('div', 'left-container-controll', 'left-container-controll side-container-controll');
  const rightContainer = genericCreateElement('div', 'right-container-controll', 'right-container-controll side-container-controll');

  headerControll.appendChild(document.createTextNode('COMANDOS'));

  const createControllHelper = (name, content, text) => {
    const variableControll = genericCreateElement('p', `${name}-controll`, `${name}-controll button-controll`);
    variableControll.appendChild(document.createTextNode(content))
  
    const variableControllLabel = genericCreateElement('p', `${name}-controll-label`, `${name}-controll-label`)

    const variableControllContainer = genericCreateElement('div', `${name}ControllContainer`, `${name}-controll-container layout-controll-container`);

    variableControllLabel.appendChild(document.createTextNode(text));

    const variableArrow = genericCreateElement('div', 'arrow', 'arrow');
    
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
};

const renderTutorial  = () => {
  let playVideo = false;

  const playerUI = document.getElementById('playerUI');
  
  const playBttn = genericCreateElement('button', 'play-bttn', 'play-bttn bttn active');
  const maximizeBttn = genericCreateElement('button', 'maximize-bttn', 'maximize-bttn bttn');
  const minimizeBttn = genericCreateElement('button', 'minimize-bttn', 'minimize-bttn bttn');
  const closeBttn = genericCreateElement('button', 'close-bttn-video', 'close-bttn-video bttn');
  const controlls = genericCreateElement('div', 'player-controlls', 'player-controlls');
  const progressVideo = genericCreateElement('div', 'progress-video', 'progress-video bttn');
  const markProgress = genericCreateElement('div', 'mark-progress', 'mark-progress bttn');
  const tutorialPlayer = genericCreateElement('div', 'tutorial-player', 'tutorial-player');
  const tutorialContainer = genericCreateElement('div', 'tutorial-container', 'tutorial-container maximize');
  const tutorialActions = genericCreateElement('div', 'tutorial-actions', 'tutorial-actions');
  const maximizeContainer = genericCreateElement('div', 'maximize-container', 'maximize-container');
  const minimizeContainer = genericCreateElement('div', 'minimize-container', 'minimize-container');
  const playerWrapper = genericCreateElement('div', 'player-wrapper', 'player-wrapper');
  const closeContainer = genericCreateElement('div', 'close-container', 'close-container');
  const videoTimer = genericCreateElement('p', 'video-timer', 'video-timer');
  const maximizeLabel = genericCreateElement('p', 'maximize-label', 'maximize-label');
  const minimizeLabel = genericCreateElement('p', 'minimize-label', 'minimize-label');
  const closeLabel = genericCreateElement('p', 'close-label', 'close-label');
  const player = genericCreateElement('video', 'player', 'player bttn');

  player.autoplay = true;

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
    const currentMin = Math.floor(player.currentTime / 60);
    const currentSec = Math.floor(player.currentTime % 60).toString().padStart(2, '0');
    videoTimer.innerHTML = `00:${currentMin.toString().padStart(2, '0')}:${currentSec}`
    markProgress.style.marginLeft = '3';

    const totalTime = player.duration;
    const currentTime = player.currentTime;

    const percentage = (currentTime / totalTime) * 100;

    markProgress.style.marginLeft = `${percentage}%`;

    if (currentTime === totalTime) {
      playBttn.className = 'play-bttn bttn';
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
      playBttn.className = 'play-bttn bttn active';
      player.play()
      playVideo = false;
    } else {
      playBttn.className = 'play-bttn bttn';
      player.pause();
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
    tutorialContainer.className = tutorialContainer.className.replace(' maximize', ' minimize');

    document.getElementById('tutorial-player').style.height = '95%';
    document.getElementById('progress-video').style.bottom = '148px';
    document.getElementById('play-bttn').style.bottom = '81px';
    document.getElementById('video-timer').style.bottom = '33px';
    
    tutorialActions.removeChild(closeContainer);
    tutorialActions.removeChild(maximizeContainer);

    tutorialActions.appendChild(minimizeContainer)
    tutorialActions.appendChild(closeContainer)
  }

  maximizeLabel.appendChild(document.createTextNode('Maximizar Player'));

  maximizeContainer.appendChild(maximizeBttn);
  maximizeContainer.appendChild(maximizeLabel);

 

  minimizeBttn.onclick = () => {
    tutorialContainer.className = tutorialContainer.className.replace(' minimize', ' maximize');

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

  minimizeLabel.appendChild(document.createTextNode('Reduzir Player'));

  minimizeContainer.appendChild(minimizeBttn);
  minimizeContainer.appendChild(minimizeLabel);

 

  closeBttn.onclick = () => {
    const helpBttn = document.getElementById('help-bttn');
    helpBttn.className = helpBttn.className.replace(' active', '');
    helpInactive = true;
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
  const iframeContainer = genericCreateElement('div', 'iframe-container', 'iframe-container');
  const iframe = genericCreateElement('iframe', 'rpm-iframe', 'rpm-iframe');
  const closeIframe = genericCreateElement('button', 'close-frame-bttn', 'close-frame-bttn bttn');

  iframe.src = 'https://agriland.readyplayer.me/avatar?frameApi&bodyType=fullbody';
  iframe.sandbox= "allow-forms allow-scripts allow-same-origin";
  iframe.allow= "camera; microphone; geolocation; autoplay; fullscreen; encrypted-media; picture-in-picture";
  
  closeIframe.appendChild(document.createTextNode('X'));
  closeIframe.onclick = () => playerUI.removeChild(iframeContainer);
  
  iframeContainer.appendChild(closeIframe);
  iframeContainer.appendChild(iframe)
  
  playerUI.appendChild(iframeContainer);
  window.addEventListener('message', subscribe);
  document.addEventListener('message', subscribe);
}

const renderSchedule = async data => {
  const playerUI = document.getElementById('playerUI');
  
  const scheduleContainer = genericCreateElement('div', 'schedule-container', 'schedule-container');
  const backPlate = genericCreateElement('div', 'back-plate-schedule', 'back-plate-schedule');
  const headerModal = genericCreateElement('p', 'header-modal-schedule', 'header-modal-schedule');
  const wrapperRow = genericCreateElement('div', 'wrapper-row', 'wrapper-row');
  
  headerModal.appendChild(document.createTextNode('AGENDA'));

  scheduleContainer.appendChild(headerModal);

  const loading = circleLoadder();

  scheduleContainer.appendChild(loading);

  backPlate.appendChild(scheduleContainer);

  playerUI.appendChild(backPlate);

  const list = await fetchList();

  if (list.length > 0) {
    for (let el of list) {
      const startAtContent = `${el.startAt.year}/${el.startAt.month}/${el.startAt.day} ${el.startAt.hour}:${el.startAt.minute}`;
      const endAtContent = `${el.endAt.year}/${el.endAt.month}/${el.endAt.day} ${el.endAt.hour}:${el.endAt.minute}`;
      const eventMoment = `${startAtContent} | ${endAtContent}`;
      // const eventName = el.eventName;
      const eventPlace = el.placeName;
  
      const row = genericCreateElement('div', 'row-schedule', 'row-schedule');
      const rowHeader = genericCreateElement('p', 'row-header-schedule', 'row-header-schedule');
      const rowInfos = genericCreateElement('div', 'row-infos-schedule', 'row-infos-schedule');
      const eventPlaceText = genericCreateElement('p', 'event-place-text', 'event-place-text');
      const eventMomentText = genericCreateElement('p', 'event-moment-text', 'event-moment-text');
      
      eventPlaceText.appendChild(document.createTextNode(eventPlace));
  
      eventMomentText.appendChild(document.createTextNode(eventMoment))
  
      rowInfos.appendChild(eventPlaceText);
      rowInfos.appendChild(eventMomentText);
  
      row.appendChild(rowHeader);
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

  const displayChat = genericCreateElement('div', 'display-chat', 'display-chat');

  const inputChat = genericCreateElement('input', 'input-chat', 'input-chat');
  inputChat.placeholder = "Pressione 'Enter' para interagir com o chat";
  
  const closeChat = genericCreateElement('button', 'close-chat-bttn', 'close-chat-bttn bttn');
  closeChat.appendChild(document.createTextNode(''));

  const chatContainer = genericCreateElement('div', 'container-chat', 'container-chat');

  closeChat.onclick = () => {
    chatBttn.style.visibility = 'visible';
    playerUI.removeChild(chatContainer);
  };

  const chatName = genericCreateElement('p', 'chat-name', 'chat-name');
  chatName.appendChild(document.createTextNode(`Chat ${chatNameText}`));

  chatContainer.appendChild(chatName);
  chatContainer.appendChild(closeChat);
  chatContainer.appendChild(displayChat);
  chatContainer.appendChild(inputChat);

  inputChat.addEventListener('keydown', event => {
    if (event.keyCode === 13) {
      const value = inputChat.value;

      if (value !== '') {
        const user = genericCreateElement('p', 'user-message', 'user-message');
        const message = genericCreateElement('p', 'text-message', 'text-message');
        const messageContainer = genericCreateElement('div', 'message-container', 'message-container');
        
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

  const sideLeftBar = genericCreateElement('div', 'side-left-bar', 'side-left-bar');
  const topSideBar = genericCreateElement('div', 'top-side-bar', 'top-side-bar');
  
  const chatBttn = createButton(
    'chat-bttn',
    'chat-bttn bttn',
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
    'help-bttn bttn',
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
      className: 'avatar-bttn bttn',
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
      className: 'map-bttn bttn',
      onClick: () => {
        console.log('openMap');
      }
    },
    {
      id: 'schedule-bttn',
      className: 'schedule-bttn bttn',
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
      className: 'controls-bttn bttn',
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
      className: 'sound-bttn bttn',
      onClick: () => console.log('sound')
    },
    {
      id: 'logout-bttn',
      className: 'logout-bttn bttn',
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
      topSideBar.appendChild(createButton(value.id, value.className, value.onClick))
  });

  for (let el of [topSideBar, chatBttn]) sideLeftBar.appendChild(el);
  
  const hudElements = [sideLeftBar, helpBttn];

  for (let hudElement of hudElements) playerUI.appendChild(hudElement);

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
  const buttonRegister = createButtonWithText("button-register", () => window.location.replace("register.html"), "Cadastre-se");
  const buttonForget = createButtonWithText("button-forget", () => window.location.replace("forget.html"), "Esqueceu sua senha?");
  const card = genericCreateElement("div", "card-login", "card-login");
  const footerCard = genericCreateElement("div", "footer-login", "footer-login");
  const submitContainer = genericCreateElement("div", "submit-container", "submit-container");
  const title = createTitle("Login");
  const emailInput = createInput("email", "email-input", "Usuário", "email");
  const passwordInput = createInput("password", "password-input", "Senha", "password");
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