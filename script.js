const textDisplay = document.getElementById("text-display");
const textInput = document.getElementById("text-input");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const startBtn = document.getElementById("start-btn");

let timer;
let time = 0;
let testStarted = false;
let currentParagraph = "";

const paragraphs = [
    "JavaScript is the language of the web, used by millions of developers worldwide.",
    "Typing tests can help you improve your speed, accuracy, and confidence while coding.",
    "Learning to code is a journey, and building projects strengthens your understanding.",
    "Front-end development involves HTML, CSS, and JavaScript to create interactive UIs."
];

const MAX_TIME = 60; // Countdown timer

function loadParagraph() {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    currentParagraph = paragraphs[randomIndex];
    textDisplay.innerHTML = "";
    currentParagraph.split("").forEach(char => {
        const span = document.createElement("span");
        span.textContent = char;
        textDisplay.appendChild(span);
    });
}

function startTimer() {
    time = MAX_TIME;
    timerElement.textContent = time;

    timer = setInterval(() => {
        time--;
        timerElement.textContent = time;

        if (time === 0) {
            clearInterval(timer);
            finishTest();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function startTest() {
    loadParagraph();
    textInput.value = "";
    textInput.disabled = false;
    textInput.focus();
    startBtn.disabled = true;
    wpmElement.textContent = "0";
    accuracyElement.textContent = "0";
    testStarted = false;
}

textInput.addEventListener("input", () => {
    if (!testStarted) {
        startTimer();
        testStarted = true;
    }

    const userInput = textInput.value.split("");
    const spanArray = textDisplay.querySelectorAll("span");
    let correct = true;

    spanArray.forEach((span, index) => {
        const char = userInput[index];

        if (!char) {
            span.classList.remove("correct", "incorrect");
        } else if (char === span.textContent) {
            span.classList.add("correct");
            span.classList.remove("incorrect");
        } else {
            span.classList.add("incorrect");
            span.classList.remove("correct");
            correct = false;
        }
    });

    if (userInput.length >= currentParagraph.length) {
        finishTest();
    }
});

function finishTest() {
    stopTimer();
    textInput.disabled = true;
    startBtn.disabled = false;

    const userText = textInput.value;
    let correctChars = 0;

    for (let i = 0; i < currentParagraph.length; i++) {
        if (userText[i] === currentParagraph[i]) {
            correctChars++;
        }
    }

    const wordsTyped = userText.trim().split(/\s+/).length;
    const correctWords = countCorrectWords(userText, currentParagraph);

    const accuracy = ((correctChars / userText.length) * 100).toFixed(2);
    const minutes = time / 60;
    const wpm = Math.round(correctWords / minutes || 0);

    accuracyElement.textContent = isNaN(accuracy) ? "0" : accuracy;
    wpmElement.textContent = isNaN(wpm) ? "0" : wpm;
    saveResult(wpm, accuracy);
}

function countCorrectWords(userText, originalText) {
    const userWords = userText.trim().split(/\s+/);
    const originalWords = originalText.trim().split(/\s+/);
    let correct = 0;
    for (let i = 0; i < userWords.length; i++) {
        if (userWords[i] === originalWords[i]) correct++;
    }
    return correct;
}

function saveResult(wpm, accuracy) {
    const result = {
        wpm,
        accuracy,
        time: new Date().toLocaleString()
    };

    let results = JSON.parse(localStorage.getItem("typingResults")) || [];
    results.unshift(result);
    results = results.slice(0, 5);
    localStorage.setItem("typingResults", JSON.stringify(results));
    displayHistory();
}

function displayHistory() {
    const results = JSON.parse(localStorage.getItem("typingResults")) || [];
    const history = document.getElementById("result-history");
    history.innerHTML = "";

    results.forEach(r => {
        const li = document.createElement("li");
        li.textContent = `WPM: ${r.wpm}, Accuracy: ${r.accuracy}%, Time: ${r.time}`;
        history.appendChild(li);
    });
}

window.onload = displayHistory;

startBtn.addEventListener("click", startTest);
