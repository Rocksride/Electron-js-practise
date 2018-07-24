import "./stylesheets/scientificCalculator.less";
// import "./helpers/context_menu.js";

// ----------------------------------------------------------------------------

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);



(function () {
    const operators = Array.from($$('div.operator')).map(elem => elem.innerText);
    const allOperators = Array.from($$('div')).map(elem => elem.innerText);
    allOperators.push('c', 'C');
    console.log(operators);
    let type = 'deg';
    let resultArr = [];
    const resultDiv = $('.result');
    const calculationsDiv = $('.calculations');
    const clearButton = $('.clear');
    const pointButton = $('.point');
    const equalButton = $('.equal');
    const backButton = $('.back');
    const bracketsButton = $('.brackets');
    const updateResult = ((div) => (arr) => {
        calculationsDiv.innerText = arr.join('');
    })(calculationsDiv);
    const isLastCharNumber = char => [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(String).includes(char)
    const handleNumberClick = ({
        target: {
            innerText: number
        }
    }) => {
        console.log(number);
        resultArr.push(number);
        updateResult(resultArr);
    }
    const handleOperatorClick = ({
        target: {
            innerText: operator
        }
    }) => {
        console.log(operator);
        if (operators.includes(resultArr[resultArr.length - 1]) || resultArr.length === 0) return;
        resultArr.push(operator);
        updateResult(resultArr);
    }
    const handleBracketsClick = ({
        target: {
            innerText: bracket
        }
    }) => {
        console.log(bracket);
        resultArr.push(bracket);
        updateResult(resultArr);
    }
    const handleFunctionsClick = ({
        target: {
            innerText: func
        }
    }) => {
        console.log(func);
        const lastChar = resultArr[resultArr.length - 1];
        if (lastChar === func || lastChar === '²') return;
        switch (func) {
            case '^':
                {
                    if (resultArr.length === 0 || !isLastCharNumber(lastChar)) return;
                    resultArr.push(func);
                    updateResult(resultArr);
                    break;
                }
            case 'x²':
                {
                    if (resultArr.length === 0 || !isLastCharNumber(lastChar)) return;
                    resultArr.push('²');
                    updateResult(resultArr);
                    break;
                }
            default:
                {
                    if (!operators.includes(lastChar) && resultArr.length !== 0 && lastChar !== '(') {
                        resultArr.push('*');
                    }
                    resultArr.push(func, '(');
                    updateResult(resultArr);
                }
        }

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
            if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(String).includes(lastChar)) {
                resultArr.push('.');
                updateResult(resultArr);
            }
        })
        equalButton.addEventListener('click', () => {

            const replacePow = (str, pattern, func) => {
                const powIndex = str.indexOf(pattern);
                const operatorsExceptNumbers = Array.from($$('div'))
                    .map(elem => elem.innerText)
                    .filter(elem => ![1, 2, 3, 4, 5, 6, 7, 8, 9, 0].includes(elem));

                if (powIndex === -1) return str;
                const subStrBeforeIndex = str.slice(0, powIndex);
                const subStrAfterIndex = str.slice(powIndex + 1, str.length);
                const indexBefore = subStrBeforeIndex.length - subStrBeforeIndex
                    .split('')
                    .reverse()
                    .reduce(((is) => (acc, curr, i) => {

                        if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.'].map(String).includes(curr) && !is) {
                            acc = i;
                            is = true;
                        }
                        return acc;
                    })(false), subStrBeforeIndex.length);
                const indexAfter = powIndex + subStrAfterIndex
                    .split('')
                    .reduce(((is) => (acc, curr, i) => {
                        if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.'].map(String).includes(curr) && !is) {
                            acc = i;
                            is = true;
                        }
                        return acc;
                    })(false), subStrAfterIndex.length) + 1;
                const charBefore = str.slice(indexBefore, powIndex);
                const charAfter = str.slice(powIndex + 1, indexAfter);
                let temp = str.slice(0, indexBefore) + 'Math.pow(' + charBefore + ', ' + charAfter + ')' + str.slice(indexAfter, str.length);
                return temp;
            }
            const replacePow2 = (str, pattern) => {
                const powIndex = str.indexOf(pattern);
                const operatorsExceptNumbers = Array.from($$('div'))
                    .map(elem => elem.innerText)
                    .filter(elem => ![1, 2, 3, 4, 5, 6, 7, 8, 9, '.'].includes(elem));

                if (powIndex === -1) return str;
                const subStrBeforeIndex = str.slice(0, powIndex);
                const indexBefore = subStrBeforeIndex.length - subStrBeforeIndex
                    .split('')
                    .reverse()
                    .reduce(((is) => (acc, curr, i) => {
                        if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.'].map(String).includes(curr) && !is) {
                            acc = i;
                            is = true;
                        }
                        return acc;
                    })(false), subStrBeforeIndex.length);
                const charBefore = str.slice(indexBefore, powIndex);
                let temp = str.slice(0, indexBefore) + 'Math.pow(' + charBefore + ', 2)' + str.slice(powIndex + 1, str.length);
                return temp;
            }
            const replacePow3 = (str, pattern, func) => {
                const powIndex = str.indexOf(pattern+'(');
                const operatorsExceptNumbers = Array.from($$('div'))
                    .map(elem => elem.innerText)
                    .filter(elem => ![1, 2, 3, 4, 5, 6, 7, 8, 9, '.'].includes(elem));

                if (powIndex === -1) return str;
                const subStrAfterIndex = str.slice(powIndex + 3, str.length);
               
                const indexAfter = powIndex + subStrAfterIndex
                    .split('')
                    .reduce(((is) => (acc, curr, i) => {
                        if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.'].map(String).includes(curr) && !is || curr === ')') {
                            acc = i;
                            is = true;
                        }
                        return acc;
                    })(false), subStrAfterIndex.length) + 3;
                const charAfter = str.slice(powIndex + 4, indexAfter);
                let temp = str.slice(0, powIndex) + 'Math.' + pattern + '(' + (+charAfter*Math.PI/180) + '' + str.slice(indexAfter, str.length);
                return temp;
            }
             let str = null;
            if (type === 'deg') {
                let str = resultArr.join('')
                    .replace(/π/, 'Math.PI')
                    .replace(/÷/, '/')
                    .replace(/e/, 'Math.E')
                    .replace(/√/, 'Math.sqrt')
                    .replace(/ln/, 'Math.log')
                    .replace(/lg/, 'Math.log10');
                str = replacePow2(str, '²');
                str = replacePow3(str, 'sin');
                str = replacePow3(str, 'cos');
                str = replacePow3(str, 'tan');
                str = replacePow(str, '^');

                const result = eval(str);
                resultDiv.innerText = result;
                resultArr = [];
                updateResult(resultArr);
            }
            if (type === 'rad') {

                let str = resultArr.join('')
                    .replace(/π/, 'Math.PI')
                    .replace(/÷/, '/')
                    .replace(/tan/, 'Math.tan')
                    .replace(/e/, 'Math.E')
                    .replace(/sin/, 'Math.sin')
                    .replace(/√/, 'Math.sqrt')
                    .replace(/cos/, 'Math.cos')
                    .replace(/ln/, 'Math.log')
                    .replace(/lg/, 'Math.log10');
                str = replacePow2(str, '²');
                str = replacePow(str, '^');

                const result = eval(str);
                resultDiv.innerText = result;
                resultArr = [];
                updateResult(resultArr);
            }

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
        });

        $$('div.functions').forEach(elem => {
            elem.addEventListener('click', handleFunctionsClick);
        });
        $$('div').forEach(elem => {
            elem.addEventListener('click', () => {
                playRandomSound()
            })
        });
        $$('div.brackets').forEach(elem => {
            elem.addEventListener('click', handleBracketsClick);
        })
        $$('input').forEach(elem => {
            elem.addEventListener('change', (e) => {
                type = e.target.value;

            });
        })
        $('.pi').addEventListener('click', () => {
            const lastChar = resultArr[resultArr.length - 1];
            if (lastChar === 'π') return;
            if (isLastCharNumber(lastChar)) {
                resultArr.push('*');
            }
            resultArr.push('π');
            updateResult(resultArr);
        })
        $('.e').addEventListener('click', () => {
            const lastChar = resultArr[resultArr.length - 1];
            if (lastChar === 'e') return;
            if (isLastCharNumber(lastChar)) {
                resultArr.push('*');
            }
            resultArr.push('e');
            updateResult(resultArr);
        })
        $$('div.operator').forEach(elem => {
            elem.addEventListener('click', handleOperatorClick)
        })
        $$('div.number').forEach(elem => {
            elem.addEventListener('click', handleNumberClick);
        })
        const findDivByInnerHTML = text => Array.from($$('div')).filter(elem => elem.innerText === text)[0]

        document.body.addEventListener('keydown', ({
            key
        }) => {
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