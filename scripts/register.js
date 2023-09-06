import { postHttp } from "./utils.js";

const listenClickCheckBox = () => {
  const listCheckbox = [
    'cotton',
    'sugarCane',
    'soy',
    'games',
    'birds',
    'cocoa',
    'swine',
    'consumer',
    'bovine',
    'milk',
    'events',
    'others',
    'coffee',
    'fish',
    'meets',
  ]

  listCheckbox.forEach(value => {
    document.getElementById(value).addEventListener('click', () => {
      const allUnChecked = document.getElementById('allUnChecked');

      if (allUnChecked.checked) allUnChecked.checked = false;
    });
  });
}

const clearErrors = () => {
  const fields = [
    'name',
    'lastName',
    'email',
    'corpEmail',
    'password',
    'confirmPassword',
    'cpf',
    'phone',
    'acceptTerms',
    'corp',
    'role',
    'area',
    'chain',
    'areaOfInterest',
  ];

  fields.forEach(value => {
    if (value !== 'password' && value !== 'areaOfInterest') {
      const input = document.getElementById(value);
      console.log({ value, input });
      input.style.borderColor = '#dcdc01';
      const container = document.getElementById(`message-${value}`);
      const text = document.getElementById(`message-text-${value}`);
  
      if (text) {
        container.removeChild(text);
        container.style.display = 'none';
      }
    } else if (value === 'password') {
      const input = document.getElementById(value);
      input.style.borderColor = 'black';
      
      const infoPassword = document.getElementById('info-password');
      infoPassword.style.color = 'black';
    } else {
      const container = document.getElementById('message-areaOfInterest');
      const child = document.getElementById('message-text-areaOfInterest')
      if (child) container.removeChild(child);
    }
  });

};

const verifyPassword = (password) => {
  if (password.length < 8) return false;
  if (!/\d/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[\W_]/.test(password)) return false;

  return true;
}

const verifyEmail = (email) => {
  const conditional = /^[\w\.-]+@[\w\.-]+\.\w+$/;
  if (conditional.test(email)) {
    return true;
  } else {
    return false;
  }
}

const verifyPhone = (phone) => {
  if (/^(\d)\1+$/.test(phone)) return false;
  return true;
}

const verifyCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11) return false;

  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = sum % 11;
  let digit = (remainder < 2) ? 0 : 11 - remainder;
  if (parseInt(cpf.charAt(9)) !== digit) {
    return false;
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = sum % 11;
  digit = (remainder < 2) ? 0 : 11 - remainder;
  if (parseInt(cpf.charAt(10)) !== digit) {
    return false;
  }

  return true;
}

const interestList = [
  "cotton",
  "sugarCane",
  "soy",
  "games",
  "birds",
  "cocoa",
  "swine",
  "consumer",
  "bovine",
  "milk",
  "events",
  "others",
  "coffee",
  "fish",
  "meets"
]

const optionalInputs = [
  "corp",
  "corpEmail",
  "role",
  "area",
  "chain"
]

function verificarScroll() {
  var alturaConteudo = document.getElementById("images").scrollHeight;

  var alturaVisivel = document.getElementById("images").clientHeight;

  var scrollAtual = document.getElementById("images").scrollTop;

  if (scrollAtual + alturaVisivel >= alturaConteudo) {
    const button = document.getElementById("accept");
    button.disabled = false;
  } else {
    const button = document.getElementById("accept");
    button.disabled = true;
  }
}

const main = () => {
  document.getElementById('allUnChecked').checked = true;
  listenClickCheckBox();
  const checkNoPartOf = document.getElementById("noPartOf");
  checkNoPartOf.checked = true;

  document.getElementById("images").addEventListener("scroll", verificarScroll);

  const modals = document.querySelectorAll('[data-modal]');

  const checkboxs = document.querySelectorAll('.checkbox-interest')

  checkboxs.forEach(value => {
    value.addEventListener('click', () => {
      if (!value.checked) {
        const allChecked = document.getElementById('allChecked');
        allChecked.checked = false;
      }
    })
  })

  modals.forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      const modal = document.getElementById(trigger.dataset.modal);
      modal.classList.add('open');
      const exits = modal.querySelectorAll('.modal-exit');
      exits.forEach(function (exit) {
        exit.addEventListener('click', function (event) {
          event.preventDefault();
          modal.classList.remove('open');
        });
      });
      
      document.getElementById("accept").addEventListener('click', () => {
        event.preventDefault();
        modal.classList.remove('open');
        const checkbox = document.getElementById("acceptTerms");
        checkbox.checked = true;
      })
    });
  });

  document.getElementById("partOf").addEventListener("click", () => {
    const noPartOf = document.getElementById("noPartOf");
    noPartOf.checked = false; 

    for (const input of optionalInputs) {
      const inp = document.getElementById(input);
      inp.disabled = false;
    }
  });

  document.getElementById("noPartOf").addEventListener("click", () => {
    const partOf = document.getElementById("partOf");
    partOf.checked = false;

    for (const input of optionalInputs) {
      const inp = document.getElementById(input);
      inp.disabled = true;
    }
  });

  document.getElementById("allChecked").addEventListener('click', () => {
    const allUnChecked = document.getElementById("allUnChecked");
    const allChecked = document.getElementById('allChecked')
    allUnChecked.checked = !allChecked.checked;
    
    
    for (const interest of interestList) {
      const checkbox = document.getElementById(interest)
      checkbox.checked = allChecked.checked;
    }
  })

  document.getElementById("allUnChecked").addEventListener('click', () => {
    const allChecked = document.getElementById("allChecked");
    allChecked.checked = false;

    for (const interest of interestList) {
      const checkbox = document.getElementById(interest);
      checkbox.checked = false;
    }
  })

  document.getElementById("togglePassword").addEventListener('click', () => {
    const eye = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"

    passwordInput.setAttribute("type", type);

    eye.classList.toggle('fa-eye-slash');
  })

  document.getElementById("toggleConfirmPassword").addEventListener('click', () => {
    const eye = document.getElementById("toggleConfirmPassword");
    const passwordInput = document.getElementById("confirmPassword");

    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"

    passwordInput.setAttribute("type", type);

    eye.classList.toggle('fa-eye-slash');
  })

  document.getElementById("cancel-button").addEventListener("click", () => window.location.replace("player.html"));
  document.getElementById("cancel-button-footer").addEventListener("click", () => window.location.replace("player.html"));

  document.getElementById("register-button").addEventListener("click", async () => {
    clearErrors();
    const loading = document.getElementById("loading");
    const button = document.getElementById("register-button");
    
    button.style.display = "none";
    loading.style.display = "block";
    
    const alert = document.getElementById("alert");
    
    alert.innerHTML = "";

    let errors = []

    try {
      const name =  document.getElementById("name").value;
      const lastName =  document.getElementById("lastName").value;
      const noPartOf = document.getElementById("noPartOf").checked;
      const email = document.getElementById("email").value;
      const corpEmail = document.getElementById("corpEmail").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const cpf = document.getElementById("cpf").value;
      const phone = document.getElementById("phone").value;
      const acceptTerms = document.getElementById("acceptTerms").checked;
      const corp = document.getElementById("corp").value;
      const role = document.getElementById("role").value;
      const area = document.getElementById("area").value;
      const chain = document.getElementById("chain").value;
      const allUnChecked = document.getElementById('allUnChecked').checked;
      
      if (name.length === 0) errors.push({ field: 'name', message: 'O campo nome é obrigatório.' });
      if (lastName.length === 0) errors.push({ field: 'lastName', message: 'O campo sobrenome é obrigatório.' });
      if (!verifyPassword(password)) errors.push({ field: 'password', message: 'Senha fraca.'});
      if (password !== confirmPassword || password.length === 0) errors.push({ field: 'confirmPassword', message: 'Senhas não coincidem.' });
      if (!verifyCPF(cpf)) errors = [ ...errors, { field: 'cpf', message: 'Insira um CPF válido.'}];
      if (!verifyPhone(phone) || phone.length === 0) errors.push({ field: 'phone' , message: 'Insira um número de telefone válido.'});
      if (!verifyEmail(email)) errors.push({ field: 'email' , message: 'Insira um e-mail válido'});
      if (!acceptTerms) errors.push({ field: 'acceptTerms' , message: 'Os termos de aceite não foram aprovados.'});

      if (!noPartOf) {
        if (!corp) errors.push({ field: 'corp' , message: 'O campo de corporação é obrigatório.'});
        if (!verifyEmail(corpEmail)) errors.push({ field: 'corpEmail' , message: 'Insira um e-mail válido.'});
        if (role.length === 0) errors.push({ field: 'role' , message: 'O campo de cargo é obrigatório.'});
        if (area.length === 0) errors.push({ field: 'area' , message: 'O campo de área de atuação é obrigatório.'});
        if (chain.length === 0) errors.push({ field: 'chain' , message: 'O campo de cadeia produtiva é obrigatório.'});
      }

      const translateCheckbox = (field, text) => document.getElementById(field).checked ? `${text},` : "";

      const areaOfInterest = `${translateCheckbox("cotton", 'Algodão')}${translateCheckbox("sugarCane", 'Cana de Açucar')}${translateCheckbox("soy", 'Soja')}${translateCheckbox("games", "Games")}${translateCheckbox("birds", 'Aves')}${translateCheckbox("cocoa", 'Cacau')}${translateCheckbox("swine", 'Suíno')}${translateCheckbox("consumer", "Consumo")}${translateCheckbox("bovine", 'Bovino')}${translateCheckbox("milk", 'Leite e derivados')}${translateCheckbox("events", "Eventos")}${translateCheckbox("coffee", 'Café')}${translateCheckbox("fish", 'Pescado')}${translateCheckbox("meets", 'Reuniões')}`.replace(' ', '');    
      
      const formatAreaOfInterest = areaOfInterest.slice(0, -1);

      if (formatAreaOfInterest.length === 0) {
        if (!allUnChecked) {
          errors.push({ field: 'areaOfInterest', message: 'Selecione área de interesse' });
        }
      }

      if (errors.length > 0) {
        errors.forEach(value => {
          const { field, message } = value;

          console.log(field);

          if (field !== 'password' && field !== 'areaOfInterest') {
            const messageContainer = document.getElementById(`message-${field}`);
  
            messageContainer.style.display = 'block';
  
            const messageText = document.createElement('p');
            messageText.appendChild(document.createTextNode(message))
            messageText.id = `message-text-${field}`;
            messageText.className = 'message-text';
            
            const input = document.getElementById(field);
            input.style.borderColor = 'red';
  
            messageContainer.appendChild(messageText);
          } else if (field === 'password') {
            const input = document.getElementById(field);
            input.style.borderColor = 'red';

            const infoPassword = document.getElementById('info-password');
            infoPassword.style.color = 'red';
          } else {
            const messageAreaOfInterest = document.getElementById('message-areaOfInterest');

            messageAreaOfInterest.style.display = 'block';
  
            const messageText = document.createElement('p');
            messageText.appendChild(document.createTextNode(message))
            messageText.id = `message-text-${field}`;
            messageText.className = 'message-text';
  
            messageAreaOfInterest.appendChild(messageText);
          }

        })

        throw new Error('');
      }

      let data = {
        name,
        lastName,
        partOf: document.getElementById("partOf").checked,
        acceptTerms,
        email,
        corpEmail,
        phone,
        password,
        cpf,
      };
      
      if (!noPartOf) {
        data = {
          ...data,
          corpEmail,
          corp,
          role,
          area,
          chain
        }
      }

      data = { ...data, areaOfInterest: formatAreaOfInterest };
      
      

      // postHttp(
      //   '/unauth/signup',
      //   (data) => window.location.replace("player.html"),
      //   () => {
      //     loading.style.display = "none";
      //     button.style.display = "block";
      //     console.error('Erro na requisição. Status:', request.status);
      //   },
      //   () => {
      //     loading.style.display = "none";
      //     button.style.display = "block";
      //     alert.innerHTML = "<p>Não foi possível cadastrar o usuário.</p>"
      //   },
      //   data
      // );

    } catch (err) {
      loading.style.display = "none";
      button.style.display = "block";

      const message = String(err).replace("Error: ", '');

      if (message.length === "Error") alert.innerHTML = message;
    }
  });
};

document.addEventListener("DOMContentLoaded", () => main());
