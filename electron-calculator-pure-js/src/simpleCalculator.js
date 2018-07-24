import "./stylesheets/simpleCalculator.less";
import "./helpers/context_menu.js";

// ----------------------------------------------------------------------------

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);



(function () {
    const operators = Array.from($$('div.operator')).map(elem => elem.innerText);
    const allOperators = Array.from($$('div')).map(elem => elem.innerText);
    allOperators.push('c', 'C');
    console.log(operators);

    let resultArr = [];
    const resultDiv = $('.result');
    const calculationsDiv = $('.calculations');
    const clearButton = $('.clear');
    const pointButton = $('.point');
    const equalButton = $('.equal');
    const backButton = $('.back');

    const updateResult = ((div) => (arr) => {
        calculationsDiv.innerText = arr.join('');
    })(calculationsDiv);

    const handleNumberClick = ({ target: { innerText: number } }) => {
        resultArr.push(number);
        updateResult(resultArr);
    }
    const handleOperatorClick = ({ target: { innerText: operator } }) => {
        if (operators.includes(resultArr[resultArr.length - 1]) || resultArr.length === 0) return;
        resultArr.push(operator);
        updateResult(resultArr);
    }
    const emulateClick = (() => {
        let subscription = null;
        let target = null;
        return btn => classToAdd => {
            clearTimeout(subscription);
            target && target.classList.remove(classToAdd);
            btn.classList.add(classToAdd);
            subscription = setTimeout(() => {
                btn.classList.remove(classToAdd);
            }, 100);
            target = btn;
        }
    })();
    const playRandomSound = () => {

        // const sounds = $$('audio');
        // const index = Math.floor(Math.random() * 9);
        // const sound = sounds[index];
        const sound = $('#sound');
        sound.currentTime = 0;
        sound.play();
    }
    const addListeners = () => {
        pointButton.addEventListener('click', () => {
            const lastChar = resultArr[resultArr.length - 1];
            if ([1,2,3,4,5,6,7,8,9,0].map(String).includes(lastChar)) {
                resultArr.push('.');
                updateResult(resultArr);
            }
        })
        equalButton.addEventListener('click', () => {
            const str = resultArr.join('');
            const result = eval(str);
            resultDiv.innerText = result;
            resultArr = [];
            updateResult(resultArr);
            
        })
        backButton.addEventListener('click', () => {
            resultArr = resultArr.slice(0, resultArr.length - 1);
            updateResult(resultArr);
        })
        clearButton.addEventListener('click', (e) => {
            console.log(e);
            resultArr = [];
            calculationsDiv.innerText = '';
            resultDiv.innerText = '0'
        })
        $$('div.operator').forEach(elem => {
            elem.addEventListener('click', handleOperatorClick)
        })
        $$('div.number').forEach(elem => {
            elem.addEventListener('click', handleNumberClick);
        })
        const findDivByInnerHTML = text => Array.from($$('div')).filter(elem => elem.innerText === text)[0]

        document.body.addEventListener('keydown', ({ key }) => {
            playRandomSound();
            const clickEvent = new Event('click');

            if (allOperators.includes(key)) {
                const btn = findDivByInnerHTML(key);
                btn.dispatchEvent(clickEvent);
                emulateClick(btn)('active');
            }
            if (key === 'Backspace') {
                const btn = $('.back');
                btn.dispatchEvent(clickEvent);
                emulateClick(btn)('active');
            }
            if (key === 'Enter') {
                const btn = findDivByInnerHTML('=');
                btn.dispatchEvent(clickEvent);
                emulateClick(btn)('active');
            }

        })
    }
    addListeners();

})()