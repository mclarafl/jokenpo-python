const OPCOES = ['pedra', 'papel', 'tesoura'];
const VITORIAS_PARA_GANHAR = 3;

const CORES = {
  a: '#a99ad6', b: '#5e4c94', c: '#f4efff',
  d: '#31e6ff', e: '#ff3d9a', f: '#ffd93d'
};

const SPRITES = {
  pedra: [
    '............',
    '....aaaa....',
    '...accaaa...',
    '..accaaaab..',
    '.aaaaaaaabb.',
    '.aaaaabaabb.',
    '.aabaaaaabb.',
    '.aaaaaaabbb.',
    '..aaaaabbb..',
    '...bbbbbb...',
    '............',
    '............'],
  papel: [
    '..cccccccc..',
    '..cccccccc..',
    '..cbbbbbbc..',
    '..cccccccc..',
    '..cbbbbbbc..',
    '..cccccccc..',
    '..cbbbbbbc..',
    '..cccccccc..',
    '..cbbbbccc..',
    '..cccccccc..',
    '..cccccccc..',
    '............'],
  tesoura: [
    '.c........c.',
    '.cc......cc.',
    '..cc....cc..',
    '...cc..cc...',
    '....cccc....',
    '.....cc.....',
    '....eeee....',
    '..eee..eee..',
    '.ee.e..e.ee.',
    '.ee.e..e.ee.',
    '..ee....ee..',
    '............'],
  misterio: [
    '............',
    '...ffffff...',
    '..ff....ff..',
    '..ff....ff..',
    '.......ff...',
    '......ff....',
    '.....ff.....',
    '.....ff.....',
    '............',
    '.....ff.....',
    '.....ff.....',
    '............']
};

let estado;
let audio;

const el = id => document.getElementById(id);
const espera = ms => new Promise(resolve => setTimeout(resolve, ms));

function desenhar(canvas, nome) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 12, 12);
  SPRITES[nome].forEach((linha, y) => {
    [...linha].forEach((cor, x) => {
      if (cor !== '.') {
        ctx.fillStyle = CORES[cor];
        ctx.fillRect(x, y, 1, 1);
      }
    });
  });
}

function bip(frequencia, duracao = 0.09) {
  try {
    audio = audio || new AudioContext();
    const oscilador = audio.createOscillator();
    const volume = audio.createGain();
    oscilador.type = 'square';
    oscilador.frequency.value = frequencia;
    volume.gain.value = 0.03;
    oscilador.connect(volume).connect(audio.destination);
    oscilador.start();
    oscilador.stop(audio.currentTime + duracao);
  } catch (erro) {
    console.warn('Som indisponível', erro);
  }
}

function atualizarHud() {
  const vidas = perdidas => '♥'.repeat(VITORIAS_PARA_GANHAR - perdidas) + '♡'.repeat(perdidas);
  el('youPoints').textContent = `${estado.voce}/${VITORIAS_PARA_GANHAR}`;
  el('cpuPoints').textContent = `${estado.cpu}/${VITORIAS_PARA_GANHAR}`;
  el('youLives').textContent = vidas(estado.cpu);
  el('cpuLives').textContent = vidas(estado.voce);
  el('round').textContent = `ROUND ${estado.rodada}`;
}

function mensagem(texto, classe = '') {
  el('message').textContent = texto;
  el('message').className = `message ${classe}`;
}

function travar(travado) {
  document.querySelectorAll('#controls button').forEach(botao => {
    botao.disabled = travado;
  });
}

async function pedirResultado(jogador) {
  const resposta = await fetch('/api/jogar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jogador })
  });
  if (!resposta.ok) throw new Error(`Servidor respondeu ${resposta.status}`);
  return resposta.json();
}

async function jogar(jogador) {

  const acabou = estado.voce === VITORIAS_PARA_GANHAR || estado.cpu === VITORIAS_PARA_GANHAR;
  if (estado.ocupado || acabou) return;

  estado.ocupado = true;
  travar(true);

  desenhar(el('youSprite'), 'pedra');
  desenhar(el('cpuSprite'), 'pedra');
  el('arena').classList.add('shake');
  for (const numero of ['3', '2', '1']) {
    mensagem(numero);
    bip(330);
    await espera(420);
  }
  el('arena').classList.remove('shake');

  let computador, resultado;
  try {
    ({ computador, resultado } = await pedirResultado(jogador));
  } catch (erro) {
    console.error(erro);
    mensagem('ERRO DE CONEXÃO. TENTE DE NOVO.', 'lose');
    estado.ocupado = false;
    travar(false);
    return;
  }

  desenhar(el('youSprite'), jogador);
  desenhar(el('cpuSprite'), computador);
  const nomes = `${jogador.toUpperCase()} x ${computador.toUpperCase()}`;

  if (resultado === 'vitoria') {
    estado.voce++;
    mensagem(`${nomes}: PONTO SEU!`, 'win');
    bip(660, 0.2);
  } else if (resultado === 'derrota') {
    estado.cpu++;
    mensagem(`${nomes}: PONTO DA CPU`, 'lose');
    bip(150, 0.25);
  } else {
    mensagem(`${nomes}: EMPATE`, 'draw');
    bip(440);
  }

  estado.rodada++;
  estado.ocupado = false;
  atualizarHud();

  if (estado.voce === VITORIAS_PARA_GANHAR) {
    mensagem('VOCÊ VENCEU A PARTIDA!', 'win');
    fimDeJogo();
  } else if (estado.cpu === VITORIAS_PARA_GANHAR) {
    mensagem('GAME OVER', 'lose');
    fimDeJogo();
  } else {
    travar(false);
  }
}

function fimDeJogo() {
  el('restart').hidden = false;
  el('restart').focus();
}

function novoJogo() {
  estado = { voce: 0, cpu: 0, rodada: 1, ocupado: false };
  el('restart').hidden = true;
  desenhar(el('youSprite'), 'pedra');
  desenhar(el('cpuSprite'), 'misterio');
  atualizarHud();
  mensagem('INSIRA SUA JOGADA');
  travar(false);
}

OPCOES.forEach((opcao, indice) => {
  const botao = document.createElement('button');
  botao.type = 'button';

  const icone = document.createElement('canvas');
  icone.width = 12;
  icone.height = 12;
  icone.setAttribute('aria-hidden', 'true');
  desenhar(icone, opcao);

  const rotulo = document.createElement('span');
  rotulo.textContent = opcao.toUpperCase();

  botao.append(icone, rotulo);
  botao.addEventListener('click', () => jogar(opcao));
  el('controls').append(botao);
});

el('restart').addEventListener('click', novoJogo);

addEventListener('keydown', evento => {
  const opcao = OPCOES[Number(evento.key) - 1];
  if (opcao) jogar(opcao);
});

novoJogo();