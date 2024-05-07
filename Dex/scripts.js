var apiUrl = "";
var abApiUrl = "";
var monName = document.querySelector('.name');
var monAbs = document.querySelector('.abs');
var monStats = document.querySelector('.stats');
var monMoves = document.querySelector('.moveSet');
var monTypes = document.querySelector('.type');
var moniD = '1';
var monEnteredName = '';
const spriteDiv = document.getElementById("sprites");
const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");
var sprite = new Image();
const monList = document.querySelector('.monList');
const abEx = document.querySelector('.abEx');

document.onkeydown = keydown;

function keydown(evt){
    if(!evt) evt = KeyboardEvent;

    if (evt.keyCode === 13){
        server();
      
    }
}


async function server(){

  monEnteredName = document.querySelector('.monInput').value.toLowerCase();

  if (monEnteredName == ''){
  apiUrl = `https://pokeapi.co/api/v2/pokemon/${moniD}`;
  }else{
  apiUrl = `https://pokeapi.co/api/v2/pokemon/${monEnteredName}`;
  }

  const response = await fetch(apiUrl);
  const data = await response.json(); 

  abEx.style.display = 'none';
  clearInfo();
  showMon(data);

}

function showMon(data){
    const pokeData = JSON.stringify(data, null, 2); 
    const dexData = JSON.parse(pokeData);

    moniD = dexData.id;

    //Sprite
    const finalImage = dexData.sprites.front_default;
    sprite.src = finalImage;
    spriteDiv.appendChild(sprite);

    //Name
    const name = dexData.name;
    monName.innerHTML += `<b>${name.charAt(0).toUpperCase() + name.slice(1)}</b>`;
    

    //Type
    for(let type of dexData.types){
        monTypes.innerHTML += `<b>${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</b> `
    }


    //Abilities
    for(let abs of dexData.abilities){
        monAbs.innerHTML += `<a href="#" id="abilityLink" onclick='showAbility(this);' value=${abs.ability.name}><b><br/>${abs.ability.name.charAt(0).toUpperCase() + abs.ability.name.slice(1)}</b></a>`; 
    }

    //Stats
    for(let stats of dexData.stats){
        monStats.innerHTML += `<b><br/>${stats.stat.name.charAt(0).toUpperCase() + stats.stat.name.slice(1)}: ${stats.base_stat} </b>`;
    }
    
    //Moveset
    for(let moves of dexData.moves){
        monMoves.innerHTML += `<b>${moves.move.name.charAt(0).toUpperCase() + moves.move.name.slice(1)},<b> `;
    }
}

async function showAbility(lnk){
    var clkAbililty = lnk.getAttribute('value');

    abApiUrl = `https://pokeapi.co/api/v2/ability/${clkAbililty}`;
    
    const abRespond = await fetch(abApiUrl);
    const abData = await abRespond.json();

    //console.log(abData);


    for(var i = 0; i < abData.effect_entries.length; i++){
        if (abData.effect_entries[i].language.name === 'en'){
            abEx.style.display = 'block';
            abEx.innerHTML = abData.effect_entries[i].short_effect;
        }
    }
}

function clearInfo(){
    monMoves.innerHTML = "Moveset: ";
    monStats.innerHTML = "Base Stats: ";
    monAbs.innerHTML = "Abilities: ";
    monTypes.innerHTML = "Type(s): ";
    monName.innerHTML = "Name: ";
    document.querySelector('.monInput').value = '';

}

arrowLeft.addEventListener("click", decrement);
arrowRight.addEventListener("click", increment);

function decrement(){
   if(moniD != 1){
     moniD -= 1;
     clearInfo();
     server();
   }
}

function increment(){
  console.log(moniD);
    moniD = parseInt(moniD);
    moniD += 1;
    moniD = moniD.toString();
    clearInfo();
    server();
}

