var apiUrl = "";
var abApiUrl = "";
var monName = document.querySelector('.name');
var monAbs = document.querySelector('.abs');
var monStats = document.querySelector('.stats');
var monMoves = document.querySelector('.moveSet');
var monTypes = document.querySelector('.type');
var container = document.querySelector('.container');
var comparison = document.querySelector('.comparison');
var itemB = document.querySelector('.item-b');
var moniD = '1';
var moniDb = 0;
var monEnteredName = '';
var monEnteredNameB = '';
const spriteDiv = document.getElementById("sprites");
const spriteDivB = document.getElementById("spritesB");
const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");
var sprite = new Image();
var spriteTwo = new Image();
const monList = document.querySelector('.monList');
const abEx = document.querySelector('.abEx');
const abExB = document.querySelector('.abExB');
const monOne = document.querySelector('.monOne');
const monTwo = document.querySelector('.monTwo');
var monNameB = document.querySelector('#nameB');
var monTypeB = document.querySelector('#typeB');
var monAbsB = document.querySelector('#absB');
var monStatsB = document.querySelector('#statsB');
var monMovesB = document.querySelector('#moveSetB');
const arrowLeftB = document.getElementById("arrowLeftB");
const arrowRightB = document.getElementById("arrowRightB");
let statsArray = [];
let statsArrayB = [];
let statsName = [];
let isComparing = false;

document.onkeydown = keydown;

function keydown(evt){
    if(!evt) evt = KeyboardEvent;

    if (evt.keyCode === 13){
        server();
      
    }
}

async function server(){

monEnteredName = document.querySelector('.monInput').value.toLowerCase();

    if(monOne.value != ''){
        apiUrl = `https://pokeapi.co/api/v2/pokemon/${monOne.value}`;
    }else if (monEnteredName == ''){
        apiUrl = `https://pokeapi.co/api/v2/pokemon/${moniD}`;
    }else{
        apiUrl = `https://pokeapi.co/api/v2/pokemon/${monEnteredName}`;
    }
   

 const response = await fetch(apiUrl);
  const data = await response.json(); 

  abEx.style.display = 'none';
  clearInfo(true, false);
  showMon(data);

}

function showMon(data){
    const pokeData = JSON.stringify(data, null, 2); 
    const dexData = JSON.parse(pokeData);

    moniD = dexData.id;

    console.log(data);

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
        monAbs.innerHTML += `<a href="#" id="abilityLink" onclick='showAbility(this, true, false);' value=${abs.ability.name}><b><br/>${abs.ability.name.charAt(0).toUpperCase() + abs.ability.name.slice(1)}</b></a>`; 
    }

    //Stats
    for(let stats of dexData.stats){
        monStats.innerHTML += `<b><br/>${stats.stat.name.charAt(0).toUpperCase() + stats.stat.name.slice(1)}: ${stats.base_stat} </b>`;
    }

    for(var i = 0; i < dexData.stats.length; i++){
        statsArray[i] = dexData.stats[i].base_stat;
    }

    if (isComparing){
        calcDifferences();
    }
    //Moveset
    /*
    for(let moves of dexData.moves){
        monMoves.innerHTML += `<b>${moves.move.name.charAt(0).toUpperCase() + moves.move.name.slice(1)},<b> `;
    }*/
}

async function showAbility(lnk, monOne, monTwo){
    var clkAbililty = lnk.getAttribute('value');

   abApiUrl = `https://pokeapi.co/api/v2/ability/${clkAbililty}`;
    
    const abRespond = await fetch(abApiUrl);
    const abData = await abRespond.json();

if (monOne){
    for(var i = 0; i < abData.effect_entries.length; i++){
        if (abData.effect_entries[i].language.name === 'en'){
            abEx.style.display = 'block';
            abEx.innerHTML = abData.effect_entries[i].short_effect;
        }
    }
}

if(monTwo){
    for(var i = 0; i < abData.effect_entries.length; i++){
        if (abData.effect_entries[i].language.name === 'en'){
            abExB.style.display = 'block';
            abExB.innerHTML = abData.effect_entries[i].short_effect;
        }
    }
 }

}

function clearInfo(monOne, monTwo){
    
    if(monOne){
        //monMoves.innerHTML = "Moveset: ";
        monAbs.innerHTML = "Abilities: ";
        monTypes.innerHTML = "Type(s): ";
        monName.innerHTML = "Name: ";
        document.querySelector('.monInput').value = '';
        document.querySelector('.monOne').value = '';
        monStats.innerHTML = "Base Stats: ";
    }

    if(monTwo){
       // monMovesB.innerHTML = "Moveset: ";
        monAbsB.innerHTML = "Abilities: ";
        monTypeB.innerHTML = "Type(s): ";
        monNameB.innerHTML = "Name: ";
        document.querySelector('.monInputTwo').value = '';
        document.querySelector('.monTwo').value = '';
        monStatsB.innerHTML = "Base Stats: ";
    }
}

arrowLeft.addEventListener("click", function(){
    decrement(true, false);
});

arrowRight.addEventListener("click", function(){
    increment(true, false);
});

//Mon Two
arrowLeftB.addEventListener("click", function(){
    decrement(false, true);
});

arrowRightB.addEventListener("click", function(){
    increment(false, true);
});



function decrement(monOne, monTwo){

if(monOne){
    if(moniD != 1){
         moniD -= 1;
        server();
    }
}

if(monTwo){
    if(moniDb != 1){
        moniDb -= 1;
       serverTwo();
}
}}


function increment(monOne, monTwo){
    if(monOne){
        moniD = parseInt(moniD);
        moniD += 1;
        moniD = moniD.toString();
        server();
    }

    if(monTwo){
        moniDb = parseInt(moniDb);
        moniDb += 1;
        moniDb = moniDb.toString();
        serverTwo();
    }  
}

 function compare(){
    //Grab values in first and second input values and then run their names through API call
    isComparing = true;

    container.style.display = 'grid'
    container.style.gridTemplateColumns = "50%";
    comparison.style.display = 'block';
    itemB.style.display = 'block';


    if (monOne.value != "" && monTwo.value != ""){
        server();
        serverTwo();
    }
}


async function serverTwo(){
    
    monEnteredNameB = document.querySelector('.monInputTwo').value.toLowerCase();
   
    if(monTwo.value != ''){
       compAPI = `https://pokeapi.co/api/v2/pokemon/${monTwo.value}`;
    }else if(monEnteredNameB == ''){
        compAPI = `https://pokeapi.co/api/v2/pokemon/${moniDb}`;
    }else{
        compAPI = `https://pokeapi.co/api/v2/pokemon/${monEnteredNameB}`;
    }

    const compResponse = await fetch(compAPI);
    const data = await compResponse.json(); 



    clearInfo(false, true);
    showMonTwo(data);

}


function showMonTwo(data){

    moniDb = parseInt(data.id);


    const finalImageTwo = data.sprites.front_default;
    spriteTwo.src = finalImageTwo;
    spriteDivB.appendChild(spriteTwo);

    //Name
    const name = data.name;
    monNameB.innerHTML += `<b>${name.charAt(0).toUpperCase() + name.slice(1)}</b>`;

    //Type
    for(let type of data.types){
        monTypeB.innerHTML += `<b>${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</b> `
    }

    //Abilities
    for(let abs of data.abilities){
        monAbsB.innerHTML += `<a href="#" id="abilityLinkB" onclick='showAbility(this, false, true);' value=${abs.ability.name}><b><br/>${abs.ability.name.charAt(0).toUpperCase() + abs.ability.name.slice(1)}</b></a>`; 
    }

    //Stats
    for(let stats of data.stats){
        monStatsB.innerHTML += `<b><br/>${stats.stat.name.charAt(0).toUpperCase() + stats.stat.name.slice(1)}: ${stats.base_stat} </b>`;
    }

    for(var i = 0; i < data.stats.length; i++){
        statsArrayB[i] = data.stats[i].base_stat;
        statsName[i] = data.stats[i].stat.name;
    }  

    calcDifferences();
    /*//Moveset
    for(let moves of data.moves){
        monMovesB.innerHTML += `<b>${moves.move.name.charAt(0).toUpperCase() + moves.move.name.slice(1)},<b> `;
    }*/
}

 function calcDifferences(){
    const differences = document.querySelector('.differences');  
    let differencesArr = [];

   for(var i = 0; i < statsArray.length; i++){
    differencesArr.push(`${statsArray[i] - statsArrayB[i]} <br>`);
   }
    
    differences.innerHTML = `${differencesArr.join("")} <br>`;


}

