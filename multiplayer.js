const btLocal = document.querySelector("#multiplayer #bt_local");
const btLink = document.querySelector("#multiplayer #bt_link");
const challengeLink = document.querySelector("#multiplayer #challenge_link");
const txtMultiplayerWord = document.querySelector("#multiplayer #txt_multiplayer_word");

function getMultiplayerWordIndex() {
    const typedWord = removeAccents(`${txtMultiplayerWord.value}`.toUpperCase());
    const index = normalizedWordList.indexOf(typedWord);
    if (index === -1) {
        alertUnknownWord(typedWord);
    }
    return index; 
}

btLocal.onclick = () => {
    challengeLink.style.display = 'none';
    const typedWordIndex = getMultiplayerWordIndex();
    if (typedWordIndex === -1) return;
    start(wordList[typedWordIndex]).then(() => {
        openPage('game');
        txtMultiplayerWord.value = '';
        showAlert("Pronto, agora peça para para o outro jogador descobrir a palavra!")
    });
};

btLink.onclick = async () => {
    const typedWordIndex = getMultiplayerWordIndex();
    if (typedWordIndex === -1) return;

    let url = new URL(location.href);
    url.searchParams.delete("challengeVersion");
    url.searchParams.delete("challengeIndex");
    url.searchParams.append("challengeVersion", 0);
    url.searchParams.append("challengeIndex", typedWordIndex);

    challengeLink.style.display = '';
    challengeLink.href = url.href;
    challengeLink.innerHTML = url.href;
    txtMultiplayerWord.value = '';

    copyToClipboard(challengeLink);
    showAlert("Já copiei o link!<br>Agora só enviar para o desafiado da vez 😉!", "Pronto, jogador!")
};

async function loadChallenge() {
    const url = new URL(location.href);
    await loadWordList();
    if (url.searchParams.get("challengeVersion") === "0") {
        start(wordList[url.searchParams.get("challengeIndex")]).then(() => {
            openPage('game');
            showAlert("<p>Você foi desafiado...</p><p>Boa sorte!</p>", "Bem-vindo, jogador!")
        })
    }
}
loadChallenge();

function copyToClipboard(data){
    let tempItem = document.createElement('input');
    tempItem.setAttribute('type','text');
    tempItem.setAttribute('display','none');
    let content = data;
    if (data instanceof HTMLElement) {
        content = data.innerHTML;
    }
    tempItem.setAttribute('value',content);
    document.body.appendChild(tempItem);
    tempItem.select();
    document.execCommand('copy');
    tempItem.parentElement.removeChild(tempItem);
  }