# 🎮 Jokenpô Arcade

Jogo de **pedra, papel e tesoura** (jokenpô) contra o computador, com visual de fliperama retrô: sprites em pixel art, efeito de scanlines na tela, contagem regressiva e sons em 8 bits.

O back-end é feito em **Python com Flask**, e a interface é **HTML, CSS e JavaScript puro**, sem frameworks.

## Sobre o projeto

Este é um projeto pessoal de **aprendizado e curiosidade**, criado durante os meus estudos de Python para testar conceitos na prática. A ideia nunca foi fazer um produto finalizado: o jogo serviu de pretexto para experimentar coisas como:

- organizar o código em módulos, separando as regras do jogo (`jokenpo.py`) do servidor (`app.py`);
- usar estruturas de dados do Python, como tuplas e dicionários, para representar as jogadas e as regras;
- criar um servidor web simples com Flask, com uma página e uma rota de API;
- receber e devolver dados em JSON e validar a entrada do usuário;
- conectar o back-end em Python a uma interface no navegador.

## Como jogar

- Escolha **pedra**, **papel** ou **tesoura** clicando nos botões ou usando as teclas **1**, **2** e **3**.
- Depois da contagem "3, 2, 1", as jogadas aparecem e o resultado da rodada é mostrado.
- Pedra vence tesoura, tesoura vence papel e papel vence pedra. Jogadas iguais dão empate.
- **Quem vencer 3 rodadas primeiro leva a partida.** No fim, clique em **JOGAR DE NOVO** para recomeçar.

## Tecnologias

- [Python 3](https://www.python.org/)
- [Flask](https://flask.palletsprojects.com/)
- HTML5 Canvas (sprites em pixel art)
- CSS (tema arcade com as fontes *Press Start 2P* e *VT323*, do Google Fonts)
- JavaScript (Fetch API e Web Audio API para os efeitos sonoros)

## Estrutura do projeto

```
jokenpo-python/
├── app.py               # Servidor Flask: página inicial e rota da API
├── jokenpo.py           # Regras do jogo (quem vence quem)
├── requirements.txt     # Dependências do Python
├── templates/
│   └── index.html       # Página do jogo
└── public/
    └── static/
        ├── style.css    # Visual arcade
        └── script.js    # Lógica da interface, placar, sprites e sons
```

## Como executar

1. Clone o repositório e entre na pasta:

   ```bash
   git clone https://github.com/mclarafl/jokenpo-python.git
   cd jokenpo-python
   ```

2. (Opcional, mas recomendado) Crie e ative um ambiente virtual:

   ```bash
   python -m venv venv
   source venv/bin/activate   # no Windows: venv\Scripts\activate
   ```

3. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```

4. Inicie o servidor:

   ```bash
   python app.py
   ```

5. Abra o navegador em **http://127.0.0.1:5000** e divirta-se!

## API

A jogada do computador é sorteada no servidor, e o resultado é calculado em Python.

### `POST /api/jogar`

**Corpo da requisição:**

```json
{ "jogador": "pedra" }
```

Valores aceitos: `"pedra"`, `"papel"` ou `"tesoura"`.

**Resposta (200):**

```json
{ "computador": "tesoura", "resultado": "vitoria" }
```

O campo `resultado` pode ser `"vitoria"`, `"derrota"` ou `"empate"`, sempre do ponto de vista do jogador.

**Resposta de erro (400)**, quando a jogada é inválida:

```json
{ "erro": "Jogada inválida" }
```
