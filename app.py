import random

from flask import Flask, jsonify, render_template, request

from jokenpo import OPCOES, determinar_resultado

app = Flask(__name__, static_folder='public/static', static_url_path='/static')

@app.get('/')
def inicio():
    return render_template('index.html')

@app.post('/api/jogar')
def jogar():
    dados = request.get_json(silent=True) or {}
    jogador = dados.get('jogador')

    if jogador not in OPCOES:
        return jsonify({'erro': 'Jogada inválida'}), 400

    computador = random.choice(OPCOES)
    resultado = determinar_resultado(jogador, computador)
    return jsonify({'computador': computador, 'resultado': resultado})

if __name__ == '__main__':

    app.run(debug=True)