OPCOES = ('pedra', 'papel', 'tesoura')

VENCE = {'pedra': 'tesoura', 'papel': 'pedra', 'tesoura': 'papel'}

def determinar_resultado(jogador, computador):
    if jogador == computador:
        return 'empate'
    return 'vitoria' if VENCE[jogador] == computador else 'derrota'