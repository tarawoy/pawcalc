function jokerString(i, j, modifiers) {
  let jmodifierClass = '';

  let jmodifierString = 'url(assets/Jokers.png) 0px -855px, ';
  let jmodifierPostString = '';

  if(modifiers.foil) {
    jmodifierPostString = 'url(assets/Editions.png) -71px 0, ';
  }
  else if(modifiers.holographic) {
    jmodifierPostString = 'url(assets/Editions.png) -142px 0, ';
  }
  else if(modifiers.polychrome) {
    jmodifierClass = ' polychrome';
    jmodifierPostString = 'url(assets/Editions.png) -213px 0, ';
  }
  else if(modifiers.disabled) {
    jmodifierPostString = 'url(assets/Editions.png) 71px 0, ';
  }
  else {
    jmodifierPostString = '';
  }

  switch(`${i},${j}`) {
    case '8,3': jmodifierString = `url(assets/Jokers.png) -${71*3}px -${95*9}px, `; break;
    case '8,4': jmodifierString = `url(assets/Jokers.png) -${71*4}px -${95*9}px, `; break;
    case '8,5': jmodifierString = `url(assets/Jokers.png) -${71*5}px -${95*9}px, `; break;
    case '8,6': jmodifierString = `url(assets/Jokers.png) -${71*6}px -${95*9}px, `; break;
    case '8,7': jmodifierString = `url(assets/Jokers.png) -${71*7}px -${95*9}px, `; break;
    case '12,4': jmodifierString = `url(assets/Jokers.png) -${71*2}px -${95*9}px, `; break;
  }

  // jangan set background-size/mask-size di sini kecuali sprite sheet benar-benar perlu di-scale
  return `${jmodifierClass}" style="mask-position: -${71*j}px -${95*i}px; background-repeat: no-repeat; background: ${jmodifierPostString}${jmodifierString}url(assets/Jokers.png) -${71*j}px -${95*i}px"`;
}
