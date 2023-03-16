// Constantes
const cadastroForm = document.querySelector('#cadastro-form');
const cadastrosLista = document.querySelector('#cadastros-lista');
const toggleCadastrosButton = document.querySelector('#toggle-cadastros');
const duplasLista = document.querySelector('#duplas-lista');
const gerarDuplasButton = document.querySelector('#gerar-duplas');
const gerarNovamenteButton = document.querySelector('#gerar-novamente');
const toggleDuplasButton = document.querySelector('#toggle-duplas');

// Lista de cadastros
let cadastros = [];

// Carrega os cadastros armazenados localmente
if (localStorage.getItem('cadastros')) {
    cadastros = JSON.parse(localStorage.getItem('cadastros'));
    atualizarListaDeCadastros();
}

// Função para adicionar cadastro na lista e no armazenamento local
function adicionarCadastro(cadastro) {
    // Verifica se todas as propriedades do objeto estão definidas
    if (cadastro.nome && cadastro.sexo && cadastro.nivel) {
        cadastros.push(cadastro);
        localStorage.setItem('cadastros', JSON.stringify(cadastros));
    }
    atualizarListaDeCadastros();
}

// Função para remover cadastro da lista e do armazenamento local
function removerCadastro(index) {
    cadastros.splice(index, 1);
    localStorage.setItem('cadastros', JSON.stringify(cadastros));
    atualizarListaDeCadastros();
}

function gerarDuplas() {
    // Limpa a lista de duplas
    duplasLista.innerHTML = '';

    // Separa os participantes em três listas diferentes com base no seu nível de habilidade
    const nivel1 = cadastros.filter(cadastro => cadastro.nivel === '1');
    const nivel2 = cadastros.filter(cadastro => cadastro.nivel === '2');
    const nivel3 = cadastros.filter(cadastro => cadastro.nivel === '3');

    // Cria uma lista vazia para armazenar as duplas
    const duplas = [];

    // Seleciona aleatoriamente um participante do nível 1 com base no sexo e, em seguida, seleciona aleatoriamente um participante do mesmo sexo e nível
    while (nivel1.length > 0 && (nivel2.length > 0 || nivel3.length > 0)) {
        let dupla = [];
        let participante1;
        if (nivel1.some(cadastro => cadastro.sexo === 'Feminino')) {
            participante1 = nivel1.find(cadastro => cadastro.sexo === 'Feminino');
        } else {
            participante1 = nivel1[Math.floor(Math.random() * nivel1.length)];
        }
        let participante2;
        if (nivel2.some(cadastro => cadastro.sexo === participante1.sexo)) {
            participante2 = nivel2.find(cadastro => cadastro.sexo === participante1.sexo);
        } else {
            participante2 = nivel3.find(cadastro => cadastro.sexo === participante1.sexo);
        }
        if (participante1.nivel === '1') {
            dupla.push(participante2);
            dupla.push(participante1);
        } else {
            dupla.push(participante1);
            dupla.push(participante2);
        }
        duplas.push(dupla);
        nivel1.splice(nivel1.indexOf(participante1), 1);
        nivel2.splice(nivel2.indexOf(participante2), 1);
        nivel3.splice(nivel3.indexOf(participante2), 1);
    }


    // Se sobrarem participantes do nível 2 ou 3 e houver participantes suficientes, forma as duplas restantes apenas com participantes do mesmo sexo e nível
    while (nivel2.some(cadastro => cadastro.sexo === 'Feminino') && nivel2.length > 1 && nivel3.length > 0) {
        let dupla = [];
        let participante1 = nivel2.find(cadastro => cadastro.sexo === 'Feminino');
        dupla.push(participante1);
        nivel2.splice(nivel2.indexOf(participante1), 1);
        let participante2 = nivel2.find(cadastro => cadastro.sexo === 'Feminino');
        dupla.push(participante2);
        nivel2.splice(nivel2.indexOf(participante2), 1);
        duplas.push(dupla);
    }
    while (nivel3.some(cadastro => cadastro.sexo === 'Feminino') && nivel3.length > 1 && nivel2.length > 0) {
        let dupla = [];
        let participante1 = nivel3.find(cadastro => cadastro.sexo === 'Feminino');
        dupla.push(participante1);
        nivel3.splice(nivel3.indexOf(participante1), 1);
        let participante2 = nivel2.find(cadastro => cadastro.sexo === 'Masculino');
        dupla.push(participante2);
        nivel2.splice(nivel2.indexOf(participante2), 1);
        duplas.push(dupla);
    }

    // Se ainda sobrarem participantes do nível 2 ou 3, forma as duplas restantes apenas com participantes do mesmo nível
    while (nivel2.length > 1) {
        let dupla = [];
        let participante1 = nivel2[Math.floor(Math.random() * nivel2.length)];
        dupla.push(participante1);
        nivel2.splice(nivel2.indexOf(participante1), 1);
        let participante2 = nivel2[Math.floor(Math.random() * nivel2.length)];
        dupla.push(participante2);
        nivel2.splice(nivel2.indexOf(participante2), 1);
        duplas.push(dupla);
    }
    while (nivel3.length > 1) {
        let dupla = [];
        let participante1 = nivel3[Math.floor(Math.random() * nivel3.length)];
        dupla.push(participante1);
        nivel3.splice(nivel3.indexOf(participante1), 1);
        let participante2 = nivel3[Math.floor(Math.random() * nivel3.length)];
        dupla.push(participante2);
        nivel3.splice(nivel3.indexOf(participante2), 1);
        duplas.push(dupla);
    }

    // Exibe a lista de duplas na tela
    for (let i = 0; i < duplas.length; i++) {
        let itemLista = document.createElement('li');
        itemLista.innerHTML = `${ duplas[i][0].nome } e ${ duplas[i][1].nome }`;
        duplasLista.appendChild(itemLista);
    }
}

// Executa a função ao carregar a página
gerarDuplas();

// Função para atualizar a lista de cadastros
function atualizarListaDeCadastros() {
    cadastrosLista.innerHTML = '';

    cadastros.forEach((cadastro, index) => {
        const cadastroLi = document.createElement('li');
        cadastroLi.textContent = `${cadastro.nome} (${cadastro.sexo}, Nível ${cadastro.nivel})`;
        const removerButton = document.createElement('button');
        removerButton.textContent = 'Remover';
        removerButton.addEventListener('click', () => {
            removerCadastro(index);
        });

        cadastroLi.appendChild(removerButton);
        cadastrosLista.appendChild(cadastroLi);
    });

    // Exibe a lista de cadastros e oculta o botão de ocultar cadastros
    cadastrosLista.style.display = 'block';
    toggleCadastrosButton.textContent = 'Ocultar Cadastros';
}

// Evento para adicionar cadastro
cadastroForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nome = event.target.nome.value.trim();
    const sexo = event.target.sexo.value;
    const nivel = event.target.nivel.value;

    adicionarCadastro({ nome, sexo, nivel });

    event.target.reset();
});

// Evento para ocultar/exibir a lista de cadastros
toggleCadastrosButton.addEventListener('click', () => {
    if (cadastrosLista.style.display === 'none') {
        cadastrosLista.style.display = 'block';
        toggleCadastrosButton.textContent = 'Ocultar Cadastros';
    } else {
        cadastrosLista.style.display = 'none';
        toggleCadastrosButton.textContent = 'Exibir Cadastros';
    }
});
// Filtra as pessoas cadastradas por nível
const nivel1 = cadastros.filter(cadastro => cadastro.nivel === '1');
const nivel2 = cadastros.filter(cadastro => cadastro.nivel === '2');
const nivel3 = cadastros.filter(cadastro => cadastro.nivel === '3');
const duplas = [];
// Seleciona aleatoriamente participantes do nível 1 e nível 2/3 para formar as duplas
while (nivel1.length > 0 && (nivel2.length > 0 || nivel3.length > 0)) {
    let dupla = [];
    let participante1;
    if (nivel1.some(cadastro => cadastro.sexo === 'Feminino')) {
        participante1 = nivel1.find(cadastro => cadastro.sexo === 'Feminino');
    } else {
        participante1 = nivel1[Math.floor(Math.random() * nivel1.length)];
    }
    let participante2;
    if (nivel2.some(cadastro => cadastro.sexo === participante1.sexo)) {
        participante2 = nivel2.find(cadastro => cadastro.sexo === participante1.sexo);
    } else {
        participante2 = nivel3.find(cadastro => cadastro.sexo === participante1.sexo);
    }
    dupla.push(participante2);
    dupla.push(participante1);
    duplas.push(dupla);
    nivel1.splice(nivel1.indexOf(participante1), 1);
    nivel2.splice(nivel2.indexOf(participante2), 1);
    nivel3.splice(nivel3.indexOf(participante2), 1);
}


// Evento para gerar duplas
gerarDuplasButton.addEventListener('click', () => {
    gerarDuplas();
});

// Evento para ocultar/exibir a lista de duplas
toggleDuplasButton.addEventListener('click', () => {
    if (duplasLista.style.display === 'none') {
        duplasLista.style.display = 'block';
        toggleDuplasButton.textContent = 'Ocultar Duplas';
    } else {
        duplasLista.style.display = 'none';
        toggleDuplasButton.textContent = 'Exibir Duplas';
    }
});