/**
 * Blackjack - Multiplayer (Somente Jogador 1 e Jogador 2)
 * Regras:
 * - Jogador 1 e Jogador 2 competem entre si.
 * - O objetivo é somar pontos próximos de 21 sem ultrapassá-lo.
 */

const nipes = ['♥', '♦', '♣', '♠']
const faces = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
let baralho = []
let jogador1 = { cartas: [], pontos: 0, parou: false }
let jogador2 = { cartas: [], pontos: 0, parou: false }
let turno = 1  // Controla quem está jogando (1 para Jogador 1, 2 para Jogador 2)
let jogoEncerrado = false

function criarBaralho() {
    baralho = []
    for (let nipe of nipes) {
        for (let face of faces) {
            baralho.push({ face, nipe, valor: calcularValor(face) })
        }
    }
    baralho = baralho.sort(() => Math.random() - 0.5) // Embaralha o baralho
}

function calcularValor(face) {
    if (face === "A") return 11
    if (["J", "Q", "K"].includes(face)) return 10
    return parseInt(face)
}

function renderizarCarta(carta) {
    return `<div class="carta" style="color: ${carta.nipe === '♥' || carta.nipe === '♦' ? '#f00' : '#000'}">
                <div>${carta.face}</div>
                <div>${carta.nipe}</div>
            </div>`
}

function atualizarInterface() {
    document.getElementById('jogador1').querySelector('.cartas').innerHTML = 
        jogador1.cartas.map(renderizarCarta).join('')
    document.getElementById('jogador2').querySelector('.cartas').innerHTML = 
        jogador2.cartas.map(renderizarCarta).join('')
    document.getElementById('pontos-jogador1').innerText = `Pontos: ${jogador1.pontos}`
    document.getElementById('pontos-jogador2').innerText = `Pontos: ${jogador2.pontos}`
    
    // Atualiza a indicação do jogador da vez
    if (turno === 1) {
        document.getElementById('turno-atual').innerText = "É a vez do Jogador 1";
        document.getElementById('jogador1').classList.add('jogando');
        document.getElementById('jogador2').classList.remove('jogando');
    } else {
        document.getElementById('turno-atual').innerText = "É a vez do Jogador 2";
        document.getElementById('jogador2').classList.add('jogando');
        document.getElementById('jogador1').classList.remove('jogando');
    }
}

function novaRodada() {
    criarBaralho()
    jogador1.cartas = [baralho.pop(), baralho.pop()]
    jogador2.cartas = [baralho.pop(), baralho.pop()]
    jogador1.pontos = calcularPontos(jogador1.cartas)
    jogador2.pontos = calcularPontos(jogador2.cartas)
    jogador1.parou = false
    jogador2.parou = false
    jogoEncerrado = false
    turno = 1  // Começa com o Jogador 1
    atualizarInterface()
    document.getElementById('resultado').innerText = ''
}

function calcularPontos(cartas) {
    let pontos = cartas.reduce((acc, carta) => acc + carta.valor, 0)
    let temAs = cartas.some(carta => carta.face === "A")
    if (pontos > 21 && temAs) pontos -= 10
    return pontos
}

function comprarCarta() {
    if (jogoEncerrado) {
        exibirMensagemNovoJogo()
        return 
    }

    if (turno === 1 && jogador1.pontos < 21 && !jogador1.parou) {
        jogador1.cartas.push(baralho.pop())
        jogador1.pontos = calcularPontos(jogador1.cartas)
    } else if (turno === 2 && jogador2.pontos < 21 && !jogador2.parou) {
        jogador2.cartas.push(baralho.pop())
        jogador2.pontos = calcularPontos(jogador2.cartas)
    }

    atualizarInterface()

    if (jogador1.pontos > 21 || jogador2.pontos > 21) {
        verificarResultado()
    }
}

function parar() {
    if (jogoEncerrado) {
        exibirMensagemNovoJogo()
        return 
    }

    if (turno === 1) {
        jogador1.parou = true
        if (jogador2.parou) {
            verificarResultado()
        } else {
            turno = 2
        }
    } else {
        jogador2.parou = true
        if (jogador1.parou) {
            verificarResultado()
        } else {
            turno = 1
        }
    }

    atualizarInterface()
}

function verificarResultado() {
    if (jogador1.pontos > 21) {
        document.getElementById('resultado').innerText = "Jogador 2 venceu!"
    } else if (jogador2.pontos > 21) {
        document.getElementById('resultado').innerText = "Jogador 1 venceu!"
    } else if (jogador1.pontos === jogador2.pontos) {
        document.getElementById('resultado').innerText = "Empate!"
    } else if (jogador1.pontos > jogador2.pontos) {
        document.getElementById('resultado').innerText = "Jogador 1 venceu!"
    } else {
        document.getElementById('resultado').innerText = "Jogador 2 venceu!"
    }
    jogoEncerrado = true
}

function exibirMensagemNovoJogo() {
    document.getElementById('resultado').innerText = 
        "O jogo terminou. Clique em 'Nova Rodada' para iniciar um novo jogo."
}

// Inicializar o jogo
novaRodada()
