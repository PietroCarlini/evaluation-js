// =================================
// 🌱 1. Sélection des éléments DOM
// =================================
const btnRed = document.querySelector(".red")
const btnGreen  = document.querySelector(".green")
const btnBlue = document.querySelector(".blue")
const btnYellow = document.querySelector(".yellow")
const attemptArea = document.querySelectorAll(".user_attempt")
const renderArea = document.querySelectorAll(".render_attempt")
const log = document.querySelector(".log")
// =================================
// 🧠 2. Variables globales / état
// =================================
let secretSeq = [];
let userSeq = [];
const colors = ["🔶","🟢","🟦", "⚠️"]
const lengthSeq = 4;
let counter = 0;
let allBtns = document.querySelectorAll("button")

// =================================
// 🎊 3. Fonctions (logique métier)
// =================================
function generateSecret(){
    for(let i = 0; i < colors.length; i++){
        let nmb = Math.floor(Math.random()*4)
        secretSeq.push(colors[nmb])
    }
    return secretSeq;
}

function chooseColor(colorIndex, colorClass){
    let color = colors[colorIndex];
    userSeq.push(color);
    const div = document.createElement('div');
    div.classList.add(colorClass);
    attemptArea[counter].appendChild(div);
    ;
}

function disableButtons(){ 
    allBtns.forEach(element => {
            element.disabled = true;
    })
}

function enableButtons(){ 
    allBtns.forEach(element => {
            element.disabled = false;
    })
}

function checkLength(){
    if (userSeq.length == lengthSeq){
        disableButtons();
    } else {
        enableButtons();
    }
}

function checkGuess(userSeq, secretSeq){
    let copySecret = [...secretSeq];
    let copyUser = [...userSeq];
    let plus = 0;
    let minus = 0;

    for (let i = 0; i < userSeq.length; i++){
        if(copyUser[i] === copySecret[i]){
            plus++;
            copyUser[i] = null;
            copySecret[i] = null;
        }
    }

    for(let j = 0; j < userSeq.length; j++){
        if(copyUser[j] != null){
            let testMinus = copySecret.indexOf(copyUser[j])
            if(testMinus != -1){
                minus++;
                copyUser[j] = null;
            }
        }
    }

    return clue = {plus, minus}
}

function renderFeedback(plus, minus, counter){
    for (let i = 0; i < plus; i++){
        const divPlus = document.createElement('div');
        divPlus.classList.add("plus");
        divPlus.textContent = "+";
        renderArea[counter].appendChild(divPlus)
    }
    for (let j = 0; j < minus; j++){
        const divMinus = document.createElement('div');
        divMinus.classList.add("minus");
        divMinus.textContent = "-";
        renderArea[counter].appendChild(divMinus)
    }
}

function checkWin(plus){
    if(plus == 4){
        log.textContent = "Seauquece found! You won :)"
        disableButtons();
    } else if (counter == 10) {
        log.textContent = "No more attempts! You lost :("
        disableButtons();
    }
}

function sendSequence(){
    if(userSeq.length == 4){
        let guessClue = checkGuess(userSeq, secretSeq);
        console.log(guessClue);
        renderFeedback(guessClue.plus, guessClue.minus, counter);
        counter++;
        userSeq.length = 0;
        checkLength();
        checkWin(guessClue.plus)
    }
}

// =================================
// 🧲 4. Événements (interactions)
// =================================
generateSecret();
console.log(secretSeq);

btnRed.addEventListener('click', function(){
    chooseColor(0, "red")
    checkLength()
    sendSequence()
})
btnGreen.addEventListener('click', function(){
    chooseColor(1, "green")
    checkLength()
    sendSequence()
})
btnBlue.addEventListener('click', function(){
    chooseColor(2, "blue")
    checkLength()
    sendSequence()
})
btnYellow.addEventListener('click', function(){
    chooseColor(3, "yellow")
    checkLength()
    sendSequence()
})


