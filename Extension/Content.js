const body = document.querySelector('body');
var selectedText = "";
var map = {};

document.onkeydown = keydown;

function keydown(evt){
    if (!evt) evt = KeyboardEvent; 
    
    if (evt.shiftKey && evt.keyCode === 68) {
    findDef(selectedText);
    }
}

function findDef(selectedText){

    if (window.getSelection) {
    selectedText = window.getSelection().toString();
}
// document.getSelection
else if (document.getSelection) {
    selectedText = document.getSelection().toString();
}
// document.selection
else if (document.selection && document.selection.type != "Control") {
    selectedText =
        document.selection.createRange().text;}

if(selectedText != ''){

//const el = (sel, par) => (par||document).querySelector(sel);
const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`;
//const popup = el("#defPopup");
//popup.innerHTML = "";
var define = "";

// Make a GET request
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
   const word = JSON.stringify(data, null, 2);
   const worded = JSON.parse(word);
   for(let element of worded)
    {for(let elem of element.meanings)
       {for(let def of elem.definitions)
        define += `${def.definition} \n\n`;
      // popup.innerHTML += `${def.definition}<br>`;
       //popup.style.display = 'block';
       }};
       alert(define);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
}



