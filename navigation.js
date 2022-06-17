const btTutorial = document.getElementById("bt_tutorial");
const btMultiplayer = document.getElementById("bt_multiplayer");
const backs = document.getElementsByClassName("back");
const pages = document.getElementsByClassName("page");

function openPage(page) {
    for (let i = 0; i < pages.length; i++) {
        pages.item(i).style.display = 'none';
    }
    pages.namedItem(page).style.display = '';
    focusTxtTerm();
}

btTutorial.onclick = () => openPage('howtoplay');
btMultiplayer.onclick = () => openPage('multiplayer');
for (let i = 0; i < backs.length; i++) {
    backs.item(i).onclick = () => openPage('game');
}
