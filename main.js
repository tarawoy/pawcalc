// === Sprite Config (Tambahan) ===
const JOKER_COLS = 10;
const JOKER_ROWS = 13;
const TILE_W = 71;
const TILE_H = 95;

// === Menu Tab Handling ===
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
let modifyingJokerValue = 0;

let modifyingJokerValTxt = document.getElementById('modValue');
let modifyingJokerValueDiv = document.getElementById('modifyJokerValue');
let modifyingJokerValDiv = document.getElementById('modifyJokerVal');
let modifyingJokerSellValDiv = document.getElementById('modifyJokerSellVal');
let modifyJokerDiv = document.getElementById('modifyJoker');
let highContrastDiv = document.getElementById('highContrastBtn');

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

// === Basic Hands Data (tidak diubah) ===
// [Bagian hands[], handColors[], dst tetap seperti file aslimu]
// === ... (biarkan isi array hands dari versi aslimu di sini) ===


// === Card & Joker modifiers (tidak diubah) ===
// [Bagian modifiers, setModifierString(), toggleCardModifier(), dll tetap sama]
// === ... ===


// === High Contrast Setting ===
const cardsDiv = document.getElementById('cards');
const jcardsDiv = document.getElementById('jokers');

let highContrast = window.localStorage.hc === '1';
if (highContrast) {
  highContrastDiv.innerText = 'X';
}

function cardString(i, j, hc = 0) {
  if (modifiers.stone) {
    return `${modifierClass}" style="background: ` +
      `${modifierPostString}${modifierString.slice(2)}"`;
  } else {
    return `${modifierClass}" style="background: ` +
      `${modifierPostString}url(assets/8BitDeck${(hc === 2 || (hc === 0 && highContrast)) ? '_opt2' : ''}.png) ` +
      `-${71 * j}px -${95 * i}px${modifierString}"`;
  }
}

function redrawCards() {
  let txt = '';
  for (let i = 0; i < 4; i++) {
    txt += '<div>';
    for (let j = 0; j < 13; j++) {
      txt += `<div class="tooltip"><div class="playingCard${cardString((i + 3) % 4, j)} onclick="addCard(${i}, ${j})" onmousemove='hoverCard(event)' onmouseout='noHoverCard(event)'></div></div>`;
    }
    txt += '</div>';
  }
  cardsDiv.innerHTML = txt;
}

function toggleContrast() {
  highContrast = !highContrast;
  window.localStorage.setItem('hc', highContrast ? 1 : 0);
  if (highContrast) {
    highContrastDiv.innerText = 'X';
  } else {
    highContrastDiv.innerHTML = '&nbsp;';
  }

  redrawCards();
  redrawPlayfieldHTML();
}

document.getElementById('highContrastBtn').addEventListener('click', toggleContrast);

// === Joker Sprite Function (MODIFIED) ===
function jokerString(i, j, modifiers) {
  let jmodifierClass = '';
  let jmodifierString = `url(assets/Jokers.png) 0px -${TILE_H * 9}px, `;
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

  // offset dinamis berdasarkan TILE_W dan TILE_H
  return `${jmodifierClass}" style="mask-position: -${TILE_W * j}px -${TILE_H * i}px; background: ${jmodifierPostString}${jmodifierString}url(assets/Jokers.png) -${TILE_W * j}px -${TILE_H * i}px"`;
}

// === Joker Display (diperbarui loop) ===
function jredrawCards() {
  let txt = '<div>';
  let count = 0;
  for (let i = 0; i < JOKER_ROWS; i++) {
    for (let j = 0; j < JOKER_COLS; j++) {
      const title = (jokerTexts.length > i && jokerTexts[i].length > j) ? jokerTexts[i][j][0] : 'WIP';
      const description = (jokerTexts.length > i && jokerTexts[i].length > j) ? eval('`' + jokerTexts[i][j][1] + '`') : 'WIP';
      if (title.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0 || description.replace(/\<[^\>]+\>/g, '').toLowerCase().indexOf(searchVal.toLowerCase()) >= 0) {
        txt += `<div class='tooltip'><div class="jokerCard${jokerString(i, j, jmodifiers)} onclick="addJoker(${i}, ${j})" onmousemove='hoverCard(event)' onmouseout='noHoverCard(event)'></div><span class='tooltiptext'>` +
          `<div class='title'>${title}</div><br style="display: none">` +
          `<div class='desc'><span class='descContent'>${description}</span></span>` +
          `</div></div>`;
        count++;
        if (count >= JOKER_COLS) {
          count = 0;
          txt += '</div><div>';
        }
      }
    }
  }
  txt += '</div>';
  jcardsDiv.innerHTML = txt;
}

redrawCards();
jredrawCards();

// === Sisanya tetap sama seperti main.js aslimu ===
// Semua fungsi addJoker(), removeJoker(), redrawPlayfield(), modifyJoker(), playHand(), clearHand(), dst
// tidak perlu diubah sama sekali karena hanya memanfaatkan hasil string dari jokerString().

setupWheelHandlers();
