const txtTerm = document.getElementById("txt_term");
const termList = document.getElementById("term_list");
const currentWordDiv = document.getElementById("current_word");
const tries = document.getElementById("tries");
const giveup = document.getElementById("giveup");
const tutorial = document.getElementById("tutorial");
let wordList = null;
let currentWord = null;
let tryCount = 0;

tutorial.onclick = () => {
    alert(
        "Faaaaaaala, Jogador!\n"+
        "Eu sorteei uma palavra em português com 5 letras e você precisa adivinhar que palavra é essa!\n\n"+
        "Mas relaxa que eu vou te dar umas dicas...\n"+
        "A cada palavra que você digitar eu vou dizer quais letras você acertou.\n\n"+
        "A letra que estiver na posição certa vai aparecer em VERDE.\n"+
        "Se você acertou uma letra, mas errou a posição, ela vai aparecer AMARELA.\n"+
        "Mas se a letra não está na palavra, ela vai aparecer CINZA.\n\n"+
        "Viu como é fácil!? Agora vai lá, mostra como você é inteligente!\n"
    );
};

giveup.onclick = () => {
    alert("Ah, não, Jogador!!!\n\nA palavra era: "+currentWord);
    start();
};

txtTerm.onkeyup = (evt) => {
    if (evt.keyCode === 13 || txtTerm.value.length === 5) {
        validateWord();
    }
}

function validateWord () {
    const typedWord = `${txtTerm.value}`.toUpperCase();

    if (typedWord.length != 5) return txtTerm.focus();
    
    txtTerm.value = "";
    txtTerm.focus();

    const div = document.createElement("div");
    div.classList.add("term");

    const letters = typedWord.split("");
    letters.forEach((letter, index) => {
        const span = document.createElement("span");
        span.textContent = letter;
        if (currentWord.charAt(index) === letter) {
            span.classList.add("right");
        } else if (currentWord.includes(letter)) {
            span.classList.add("wrong_position");
        } else {
            span.classList.add("wrong");
        }
        div.appendChild(span);
    });

    if (tryCount === 0) {
        termList.innerHTML = "";
    }

    termList.prepend(div);
    termList.scrollTop = 0;
    tries.textContent = `${++tryCount}`;

    if (typedWord === currentWord) {
        alert(`Boooooooa, Jogador!\n\nVocê acertou a palavra ${currentWord} em ${tryCount} tentativas!`);
        start();
    }
};

async function sortWord() {
    if (wordList === null) {
        wordList = (await (await fetch("./all_words.txt")).text()).split("\n");
    }
    currentWord = `${wordList[parseInt(Math.random() * wordList.length)]}`.toUpperCase();
    if (currentWordDiv) currentWordDiv.textContent = currentWord;
}

function start() {
    termList.innerHTML = '<span>Digite um termo para começar...</span>';
    termList.scrollTop = 0;
    sortWord();
    tryCount = 0;
    tries.innerText = '0';
}

start();
