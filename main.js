// === CONFIG ===
const JOKER_COLS = 10;
const JOKER_ROWS = 13;
const TILE_W = 71;
const TILE_H = 95;

// === MENU & TAB ===
const menuBtns = [
  document.getElementById('JokersBtn'),
  document.getElementById('CardsBtn'),
  document.getElementById('HandsBtn'),
  document.getElementById('BreakdownBtn'),
  document.getElementById('ModifyJokerBtn'),
];
const tabs = [
  document.getElementById('Jokers'),
  document.getElementById('Cards'),
  document.getElementById('Hands'),
  document.getElementById('Breakdown'),
  document.getElementById('ModifyJoker'),
];

let searchVal = '';
for (let i = 0; i < menuBtns.length; i++) {
  menuBtns[i].addEventListener('click', changeTab(i));
  tabs[i].style.display = "none";
}
let revertToTab = 0;
let modifyingJoker = false;
function changeTab(tab) {
  return () => {
    revertToTab = tab === 4 ? revertToTab : tab;
    for (let i = 0; i < menuBtns.length; i++) {
      menuBtns[i].classList.remove('active');
      tabs[i].style.display = "none";
    }
    menuBtns[tab].classList.add('active');
    tabs[tab].style.display = "block";
    modifyingJoker = false;
  };
}
changeTab(0)();

let jokerValue = 0;
let jokerCount = 1;
const jokerValueHTML = document.getElementById('jokerVal');
const jokerCountHTML = document.getElementById('jokerCnt');

function incrementJokerValue(inc) {
  jokerValue += inc;
  if (inc === 0) jokerValue = 0;
  jokerValueHTML.innerText = jokerValue;
  jredrawCards();
}
function setJokerValue() {
  jokerValue = Math.round(Number(jokerValueHTML.innerText) || 0);
  jokerValueHTML.innerText = jokerValue;
  jredrawCards();
}
function incrementJokerCount(inc) {
  jokerCount += inc;
  if (inc === 0) jokerCount = 1;
  jokerCountHTML.innerText = Math.max(1, jokerCount);
}
function setJokerCount() {
  jokerCount = Math.max(1, Math.round(Number(jokerCountHTML.innerText) || 1));
  jokerCountHTML.innerText = jokerCount;
}

// === BASED ON CARDS ===
const cardsDiv = document.getElementById('cards');
const jcardsDiv = document.getElementById('jokers');
const highContrastDiv = document.getElementById('highContrastBtn');
let highContrast = window.localStorage.hc === '1';
if (highContrast) highContrastDiv.innerText = 'X';

function toggleContrast() {
  highContrast = !highContrast;
  window.localStorage.setItem('hc', highContrast ? 1 : 0);
  highContrastDiv.innerText = highContrast ? 'X' : ' ';
  redrawCards();
  jredrawCards();
}

document.getElementById('highContrastBtn').addEventListener('click', toggleContrast);

function cardString(i, j, hc = 0) {
  return `" style="background:url(assets/8BitDeck${(hc === 2 || (hc === 0 && highContrast)) ? '_opt2' : ''}.png) -${71 * j}px -${95 * i}px"`;
}
function redrawCards() {
  let txt = '';
  for (let i = 0; i < 4; i++) {
    txt += '<div>';
    for (let j = 0; j < 13; j++) {
      txt += `<div class='tooltip'><div class='playingCard${cardString(i, j)} onclick='addCard(${i}, ${j})'></div></div>`;
    }
    txt += '</div>';
  }
  cardsDiv.innerHTML = txt;
}

// === JOKER SPRITE ===
function jokerString(i, j, modifiers) {
  let jmodifierClass = '';
  let jmodifierPostString = '';

  if (modifiers.foil)
    jmodifierPostString = 'url(assets/Editions.png) -71px 0, ';
  else if (modifiers.holographic)
    jmodifierPostString = 'url(assets/Editions.png) -142px 0, ';
  else if (modifiers.polychrome) {
    jmodifierClass = ' polychrome';
    jmodifierPostString = 'url(assets/Editions.png) -213px 0, ';
  } else if (modifiers.disabled)
    jmodifierPostString = 'url(assets/Editions.png) 71px 0, ';

  return `${jmodifierClass}" style="mask-position:-${TILE_W * j}px -${TILE_H * i}px; ` +
         `background:${jmodifierPostString}url(assets/Jokers.png) -${TILE_W * j}px -${TILE_H * i}px"`;
}

// === RENDER JOKERS ===
function jredrawCards() {
  let txt = '<div>';
  let count = 0;
  for (let i = 0; i < JOKER_ROWS; i++) {
    for (let j = 0; j < JOKER_COLS; j++) {
      const title = (jokerTexts[i] && jokerTexts[i][j]) ? jokerTexts[i][j][0] : 'WIP';
      const desc = (jokerTexts[i] && jokerTexts[i][j]) ? eval('`' + jokerTexts[i][j][1] + '`') : 'WIP';
      if (title.toLowerCase().includes(searchVal.toLowerCase()) || desc.toLowerCase().includes(searchVal.toLowerCase())) {
        txt += `<div class='tooltip'><div class="jokerCard${jokerString(i,j,{})}" onclick="addJoker(${i},${j})"></div><span class='tooltiptext'><div class='title'>${title}</div><div class='desc'><span class='descContent'>${desc}</span></div></span></div>`;
        count++;
        if (count >= JOKER_COLS) { count = 0; txt += '</div><div>'; }
      }
    }
  }
  txt += '</div>';
  jcardsDiv.innerHTML = txt;
}

// === INIT ===
redrawCards();
jredrawCards();
