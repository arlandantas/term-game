const txtTerm = document.getElementById("txt_term");
const termList = document.getElementById("term_list");
const currentWordDiv = document.getElementById("current_word");
const tries = document.getElementById("tries");
const btGiveup = document.getElementById("bt_giveup");
const WORD_MAX_LETTERS = 5;
let wordList = null;
let normalizedWordList = null;
let currentWord = null;
let normalizedCurrentWord = null;
let tryCount = 0;

btGiveup.onclick = () => {
    alert("Ah, não, Jogador!!!\n\nA palavra era: "+currentWord);
    start();
};

txtTerm.oninput = (evt) => {
    if (evt.inputType === "deleteContentBackward") {
        let onlyLettersContent = getOnlyLettersTxtTerm();
        onlyLettersContent = onlyLettersContent.substring(0, onlyLettersContent.length - 1);
        maskTxtTerm(onlyLettersContent);
        focusTxtTerm();
    } else {
        let onlyLettersContent = getOnlyLettersTxtTerm();
        if (onlyLettersContent.length === WORD_MAX_LETTERS) {
            evt.preventDefault();
            validateWord();
            setTimeout(clearTxtTerm, 100);
        } else {
            maskTxtTerm(onlyLettersContent);
            focusTxtTerm();
        }
    }
}

txtTerm.onfocus = () => focusTxtTerm()

function validateWord () {
    const typedWord = getOnlyLettersTxtTerm().toUpperCase();
    
    if (typedWord.length !== 5) return txtTerm.focus();
    
    const normalizedTypedWord = removeAccents(typedWord);
    const word_index = normalizedWordList.indexOf(normalizedTypedWord);
    if (word_index === -1) {
        return alertUnknownWord(typedWord);
    }

    const letters = typedWord.split("");
    const childs = Array(5);
    let clearedCurrentWord = `${normalizedCurrentWord}`;
    letters.forEach((letter, index) => {
        if (clearedCurrentWord.charAt(index) === letter) {
            const span = document.createElement("span");
            span.textContent = wordList[word_index].charAt(index);
            span.classList.add("right");
            childs[index] = span;
            letters[index] = null;
            clearedCurrentWord = `${
                clearedCurrentWord.substring(0, index)
            }*${
                clearedCurrentWord.substring(index+1, WORD_MAX_LETTERS)
            }`
        }
    });
    clearedCurrentWord = clearedCurrentWord.replace(/\*/g, '');
    letters.forEach((letter, index) => {
        if (letter === null) return;
        const span = document.createElement("span");
        span.textContent = wordList[word_index].charAt(index);
        if (clearedCurrentWord.includes(letter)) {
            span.classList.add("wrong_position");
            clearedCurrentWord = clearedCurrentWord.replace(letter, '');
        } else {
            span.classList.add("wrong");
        }
        childs[index] = span;
    });

    if (tryCount === 0) {
        termList.innerHTML = "";
    }

    const div = document.createElement("div");
    div.classList.add("term");
    div.append(...childs);
    termList.prepend(div);
    termList.scrollTop = 0;
    incrementTries();

    if (normalizedTypedWord === normalizedCurrentWord) {
        alert(`Boooooooa, Jogador!\n\nVocê acertou a palavra ${currentWord} em ${tryCount} tentativas!`);
        if (location.search != '') {
            location.search = '';
        } else {
            start();
        }
    }
};

async function loadWordList() {
    if (wordList === null) {
        const headers = new Headers();
        headers.append('pragma', 'no-cache');
        headers.append('cache-control', 'no-cache');

        wordList = (
            await (await fetch("./all_words.txt", { headers, method: 'GET' })).text()
        ).split("\n").map(w => `${w}`.toUpperCase());
        normalizedWordList = wordList.map(removeAccents);
    }
}

async function sortWord(word = null) {
    await loadWordList();
    if (word === null) {
        word = `${wordList[parseInt(Math.random() * wordList.length)]}`;
    }
    currentWord = word.toUpperCase();
    normalizedCurrentWord = removeAccents(currentWord);
    if (currentWordDiv) currentWordDiv.textContent = currentWord;
}

async function start(word = null) {
    termList.innerHTML = '<span>Digite um termo para começar...</span>';
    termList.scrollTop = 0;
    await sortWord(word);
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

function getOnlyLettersTxtTerm() {
    return `${txtTerm.value}`.replace(/(\s|_)/g, '');
}

function maskTxtTerm(onlyLettersContent) {
    let letters = onlyLettersContent.split('');
    letters = [
        ...letters,
        ...Array.from({length: WORD_MAX_LETTERS - letters.length}, () => "_"),
    ];
    txtTerm.value = letters.join(" ");
}

function incrementTries() {
    tries.textContent = `${++tryCount}`;
}

function removeAccents(str) {
    return `${str}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function alertUnknownWord(word) {
    alert(`Ihhh, jogador!\nEu não conheço a palavra ${word} não! 😿`);
}

start();
