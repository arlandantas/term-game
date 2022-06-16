const txtTerm = document.getElementById("txt_term");
const termList = document.getElementById("term_list");
const currentWordDiv = document.getElementById("current_word");
const tries = document.getElementById("tries");
const giveup = document.getElementById("giveup");
const tutorial = document.getElementById("tutorial");
const WORD_MAX_LETTERS = 5;
let wordList = null;
let normalizedWordList = null;
let currentWord = null;
let normalizedCurrentWord = null;
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
    if (evt.keyCode === 8) return true;
    evt.preventDefault();
    const onlyLettersContent = `${txtTerm.value}`.replace(/(\s|_)/g, '');
    if (onlyLettersContent.length === WORD_MAX_LETTERS) {
        txtTerm.value = onlyLettersContent;
        validateWord();
    } else {
        let letters = onlyLettersContent.split('');
        letters = [
            ...letters,
            ...Array.from({length: WORD_MAX_LETTERS - letters.length}, () => "_"),
        ];
        txtTerm.value = letters.join(" ");
        focusTxtTerm();
    }
}

function validateWord () {
    const typedWord = `${txtTerm.value}`.toUpperCase();
    const normalizedTypedWord = removeAccents(typedWord);

    if (normalizedTypedWord.length != 5) return txtTerm.focus();
    
    clearTxtTerm();
    if (!normalizedWordList.includes(normalizedTypedWord)) return alert(`Ihhh, jogador!\nEu não conheço a palavra ${typedWord} não! 😿`);

    const div = document.createElement("div");
    div.classList.add("term");

    const letters = normalizedTypedWord.split("");
    letters.forEach((letter, index) => {
        const span = document.createElement("span");
        span.textContent = letter;
        if (normalizedCurrentWord.charAt(index) === letter) {
            span.classList.add("right");
        } else if (normalizedCurrentWord.includes(letter)) {
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

    if (normalizedTypedWord === normalizedCurrentWord) {
        alert(`Boooooooa, Jogador!\n\nVocê acertou a palavra ${currentWord} em ${tryCount} tentativas!`);
        start();
    }
};

async function sortWord() {
    if (wordList === null) {
        wordList = (await (await fetch("./all_words.txt")).text()).split("\n").map(w => `${w}`.toUpperCase());
        normalizedWordList = wordList.map(removeAccents);
    }
    currentWord = `${wordList[parseInt(Math.random() * wordList.length)]}`.toUpperCase();
    normalizedCurrentWord = removeAccents(currentWord);
    if (currentWordDiv) currentWordDiv.textContent = currentWord;
}

function start() {
    termList.innerHTML = '<span>Digite um termo para começar...</span>';
    termList.scrollTop = 0;
    sortWord();
    tryCount = 0;
    tries.innerText = '0';
    clearTxtTerm();
}

function clearTxtTerm() {
    txtTerm.value = "_ _ _ _ _";
    focusTxtTerm();
}

function focusTxtTerm() {
    txtTerm.focus();
    const firstUnderscore = txtTerm.value.indexOf("_");
    txtTerm.setSelectionRange(firstUnderscore, firstUnderscore + 1);
}

function removeAccents(str) {
    return `${str}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

start();
