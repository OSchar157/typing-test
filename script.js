'use strict';
import { words } from './wordsList.js';


const typingTestBox = document.querySelector('.typing-test-box');
const bodyEl = document.querySelector('body');
const incorrCountEL = document.querySelector('#incorrect-count');
const timerEl = document.querySelector('#time');
const timeBtns = document.getElementsByName('time');
const resetBtn = document.querySelector('.reset');
let cursorEl;


const alphabet = 'abcdefghijklmnopqrstuvwxyz';

let timer;

let index = 0;
let strIndex = 0;
let initiated = false;
let ended = false;
let testParaStr;
let testParaArr;
let lettersEl;
let onBox = true;

setupTest();

// document.querySelector('#cursor')

function setupTest() {

    [testParaStr, testParaArr] = createPara(words);

    for (const word of testParaArr) {

        let lettersHTML = '';
        for (const char of word) lettersHTML += `<letter>${char}</letter>`;

        const newWordDiv = `<div class="word">${lettersHTML + ' '}</div>`;
        typingTestBox.insertAdjacentHTML('beforeend', newWordDiv);
    }
    typingTestBox.insertAdjacentHTML('afterbegin', '<span id="cursor"></span>');

    cursorEl = document.querySelector('#cursor');
    lettersEl = [...document.querySelectorAll('letter')];
}


for (const btn of timeBtns) {

    btn.addEventListener('click', function () {

        if (btn.checked) timerEl.textContent = btn.value;
    });
}


resetBtn.addEventListener('click', function () {

    clearInterval(timer);
    timerEl.textContent = '15';
    timeBtns[0].checked = true;
    index = 0;
    strIndex = 0;
    initiated = false;
    ended = false;
    testParaStr = '';
    testParaArr = '';
    lettersEl = '';
    cursorEl.innerHTML = '';
    document.querySelector('.typing-test-box').innerHTML = '';
    setupTest();
});

typingTestBox.addEventListener('click', function (){
    if(onBox === false ) onBox = true;
    console.log(onBox);
});

bodyEl.addEventListener('click', function(e){
    if(onBox === true) onBox = false;
    console.log(e.target)

    console.log(onBox);
});


bodyEl.addEventListener('keydown', function (e) {

    if (!ended && onBox) {

        if (!initiated) {

            console.log(initiated)

            const selectedTime = Number(document.querySelector("[name='time']:checked").value);
            let time = selectedTime

            timer = setInterval(function () {
                time--;
                timerEl.textContent = time;
                if (time === 0) {

                    clearInterval(timer);
                    incorrCountEL.textContent = wpm(selectedTime);
                    ended = true;
                    cursorEl.remove();
                }
            }, 1000);

            initiated = true;
        }

        if (alphabet.includes(e.key)) {

            currsorForw(index, cursorEl);

            if (e.key === lettersEl[index].textContent) {

                addCorrect(index);

            } else {

                addIncorrect(index);
            }

            index++;
            strIndex++;

        } else if (e.key === 'Backspace' && index > 0 && countIncorrect() > 0) {

            index--;
            testParaStr[strIndex - 1] === ' ' ? strIndex -= 2 : strIndex -= 1;
            currsorBack(index, cursorEl);
            removeClasses(index);

        } else if (e.key === ' ') {

            if (testParaStr[strIndex] === ' ') {
                strIndex++;
                lettersEl[index].parentNode.insertBefore(cursorEl, lettersEl[index]);
            } else {
                strIndex++;
                index++;
                lettersEl[index].parentNode.insertBefore(cursorEl, lettersEl[index]);
                addIncorrect(index - 1);
            }
        }
    }
});


function currsorForw(index, el) {
    lettersEl[index].parentNode.insertBefore(el, lettersEl[index].nextSibling);
}

function currsorBack(index, el) {
    lettersEl[index].parentNode.insertBefore(el, lettersEl[index]);
}

function addCorrect(index) {
    lettersEl[index].classList.add('correct');
}

function addIncorrect(index) {
    lettersEl[index].classList.add('incorrect');
}

function removeClasses(index) {
    lettersEl[index].classList.remove('incorrect');
    lettersEl[index].classList.remove('correct');
}

function wpm(time) {

    return Math.round((document.querySelectorAll('.correct').length / 5) / (time / 60));
}

function countIncorrect() {

    let incorrect = 0;

    for (const letter of lettersEl) {
        if (letter.classList[0] === 'incorrect') incorrect++;
    }
    return incorrect;
}

//create a paragraph for the user to type
function createPara(wordList) {

    let string = '';
    let array = [];

    const randomArr = randNumArr(0, words.length, 50);

    for (const num of randomArr) {

        array.push(wordList[num]);
        string += ' ' + wordList[num];
    };

    return [string.trim(), array];
}

//create an array of random numbers with no repeats
function randNumArr(min, max, len = max) {

    let arr = [];

    while (arr.length < len) {

        let randomNumber = Math.floor(Math.random() * (max - min)) + min;
        if (!arr.includes(randomNumber)) arr.push(randomNumber);
    }

    return arr;
}