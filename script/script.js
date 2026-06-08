// =================================
// 🌱 1. Sélection des éléments DOM
// =================================
const btnRed = document.querySelector(".red")
const btnGreen  = document.querySelector(".green")
const btnBlue = document.querySelector(".blue")
const btnYellow = document.querySelector(".yellow")
const attemptArea = document.querySelectorAll(".user_attempt")
const renderArea = document.querySelectorAll(".render_attempt")
const startBtn = document.querySelector(".start")
const log = document.querySelector(".log")
const resultSeq = document.querySelector(".result")
const resultTxt = document.querySelector(".text_result")
// =================================
// 🧠 2. Variables globales / état
// =================================
let secretSeq = [];
let userSeq = [];
const colors = ["🔶","🟢","🟦", "⚠️"]
const lengthSeq = 4;
let counter = 0;
let allBtns = document.querySelectorAll("button")
let second;

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
    startBtn.disabled= false;
    startBtn.classList.remove('hide') 
}

function enableButtons(){ 
    allBtns.forEach(element => {
            element.disabled = false;
    })
    startBtn.disabled = true;
    startBtn.classList.add('hide') 
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
        startBtn.textContent = "Reset"
    } else if (counter == 10) {
        log.textContent = "No more attempts! You lost :("
        disableButtons();
        clearInterval(second);
        revealSecret()
        startBtn.textContent = "RESET"
    }else {
        clearInterval(second);
        timer()
    }
}

function sendSequence(){
    if(userSeq.length == 4){
        let guessClue = checkGuess(userSeq, secretSeq);
        renderFeedback(guessClue.plus, guessClue.minus, counter);
        counter++;
        userSeq.length = 0;
        checkLength();
        checkWin(guessClue.plus)
    }
}

function forceSeq(){
    let guessClue = checkGuess(userSeq, secretSeq);
        renderFeedback(guessClue.plus, guessClue.minus, counter);
        counter++;
        userSeq.length = 0;
        checkLength();
        checkWin(guessClue.plus)
        
}

function timer(){
    const myTimer = document.querySelector(".timer");
    let maxTime = 5;
    second = setInterval(minusSecond, 1000);
    function minusSecond(){
        if(maxTime == 0){
            clearInterval(second);
            forceSeq()
        } else {
            maxTime--;
            myTimer.textContent = `Timer: ${maxTime}`
        }
    }
}

function reset(){
    secretSeq = [];
    counter = 0;
    userSeq = [];
    clearInterval(second);
    let user_attempt = document.querySelectorAll(".user_attempt");
    user_attempt.forEach(element => {
        element.innerHTML = "";
    });

    let render_attempt = document.querySelectorAll(".render_attempt");
    render_attempt.forEach(element => {
        element.innerHTML = "";
    });

    startBtn.textContent = "START";
    log.textContent = ""

    resultTxt.textContent = "";
    resultSeq.innerHTML = "";
    enableButtons()

    log.textContent = "Try to find the secret sequence."
}

function revealSecret(){
    resultTxt.textContent = "The secret sequence was:"
    for(let i = 0; i < secretSeq.length; i++){
    let divSecret = document.createElement('div');
    divSecret.classList.add("plus");
    divSecret.textContent = `${secretSeq[i]}`
    resultSeq.appendChild(divSecret)
    }
}


// =================================
// 🧲 4. Événements (interactions)
// =================================

startBtn.addEventListener('click', function(){
    reset()
    generateSecret();
    enableButtons()
    timer()
})

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


