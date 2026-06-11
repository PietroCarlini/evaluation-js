// =================================
// 🌱 1. Sélection des éléments DOM
// =================================
const btnRed = document.querySelector(".red");
const btnGreen  = document.querySelector(".green");
const btnBlue = document.querySelector(".blue");
const btnYellow = document.querySelector(".yellow");
const attemptArea = document.querySelectorAll(".user_attempt");
const renderArea = document.querySelectorAll(".render_attempt");
const startBtn = document.querySelector(".start");
const log = document.querySelector(".log");
const resultSeq = document.querySelector(".result");
const resultTxt = document.querySelector(".text_result");
const myTimer = document.querySelector(".timer");
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

// Fills secretSeq with 4 random colors
function generateSecret(){
    for(let i = 0; i < colors.length; i++){
        let nmb = Math.floor(Math.random()*4)
        secretSeq.push(colors[nmb])
    }
    return secretSeq;
}

// Starts a 20-second countdown; NB: calls forceSeq if time runs out
function timer(){
    let maxTime = 20;
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

// Adds the chosen color to userSeq and renders it in the current attempt row
function chooseColor(colorIndex, colorClass){
    let color = colors[colorIndex];
    userSeq.push(color);
    const div = document.createElement('div');
    div.classList.add(colorClass);
    attemptArea[counter].appendChild(div);
    ;
}

// Disables buttons once the sequence is complete (4 colors chosen)
function checkLength(){
    if (userSeq.length == lengthSeq){
        disableButtons();
    } else {
        enableButtons();
    }
}

// Triggered when the user completes a 4-color sequence: checks the guess and moves to the next attempt
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

// Forces submission of the current sequence when the timer runs out
function forceSeq(){
    let guessClue = checkGuess(userSeq, secretSeq);
        renderFeedback(guessClue.plus, guessClue.minus, counter);
        counter++;
        userSeq.length = 0;
        checkLength();
        checkWin(guessClue.plus)     
}

// Compares userSeq to secretSeq and returns plus (right color, right position) and minus (right color, wrong position)
function checkGuess(userSeq, secretSeq){
    let copySecret = [...secretSeq];
    let copyUser = [...userSeq];
    let plus = 0;
    let minus = 0;

    // First pass: check for right color in the right position (plus)
    // Nullify matched positions to avoid counting them again
    for (let i = 0; i < userSeq.length; i++){
        if(copyUser[i] === copySecret[i]){
            plus++;
            copyUser[i] = null;
            copySecret[i] = null;
        }
    }

    // Second pass: check for right color in the wrong position (minus)
    // Skip already nullified positions
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

// Renders + and - clue divs in the feedback area for the current attempt
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

// Checks if the player won, lost, or should continue to the next attempt
function checkWin(plus){
    if(plus == 4){
        log.textContent = "Sequence found! You won :)"
        disableButtons();
        clearInterval(second);
        startBtn.textContent = "RESET"
        
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

// Displays the secret sequence in the result area
function revealSecret(){
    resultTxt.textContent = "The secret sequence was:"
    for(let i = 0; i < secretSeq.length; i++){
    let divSecret = document.createElement('div');
    divSecret.classList.add("plus");
    divSecret.textContent = `${secretSeq[i]}`
    resultSeq.appendChild(divSecret)
    }
}

// Resets all game state and the DOM back to the initial state
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
    myTimer.textContent = "Timer: 20"
    log.textContent = ""

    resultTxt.textContent = "";
    resultSeq.innerHTML = "";
    enableButtons()

    log.textContent = "Try to find the secret sequence."
}

// Disables all buttons except the start button
function disableButtons(){ 
    allBtns.forEach(element => {
            element.disabled = true;
    })
    startBtn.disabled= false;
    startBtn.classList.remove('hide') 
}

// Enables all color buttons and hides the start button
function enableButtons(){ 
    allBtns.forEach(element => {
            element.disabled = false;
    })
    startBtn.disabled = true;
    startBtn.classList.add('hide') 
}

// =================================
// 🧲 4. Événements (interactions)
// =================================
disableButtons()

// Resets the game, generates a new secret and starts the timer
startBtn.addEventListener('click', function(){
    reset()
    generateSecret();
    enableButtons()
    timer()
})

// Each button adds its color to the sequence, checks length, and submits if complete
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


