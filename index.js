function add(a, b) {
    return a + b;
}
  
function subtract(a, b) {
    return a - b;
}
  
function multiply(a, b) {
    return a * b;
}
  
function divide(a, b) {
    if (b === 0) {
      return "Error: Divide by zero";
    }
    return a / b;
}
function operate(operator, a, b) {
    switch (operator) {
      case "+":
        return add(a, b);
      case "-":
        return subtract(a, b);
      case "*":
        return multiply(a, b);
      case "/":
        return divide(a, b);
      default:
        return "Error: Invalid operator";
    }
}

function clear() {
    displayValue = '0';
    firstOperand = null;
    waitingForSecondOperand = false;
    operator = null;
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = displayValue;
}

function inputDigit(digit) {
    if (displayValue === '0') {
        displayValue = digit;
    } else {
        displayValue += digit;
    }
}

function inputDecimal() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = operate(operator, firstOperand, inputValue);
        displayValue = `${parseFloat(result.toFixed(7))}`;
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

function calculate(expression) {
    let regex = /(\d+\.?\d*)([\+\-\*\/]?)(\d+\.?\d*)/;
    let match = regex.exec(expression);
    while (match) {
        const [fullMatch, a, operator, b] = match;
        const result = operate(operator, parseFloat(a), parseFloat(b));
        expression = expression.replace(fullMatch, result.toString());
        match = regex.exec(expression);
    }

    return parseFloat(expression);
}

const buttons = document.querySelectorAll('button');

let displayValue = '0';

let operator = '';

let firstOperand = '';

let waitingForSecondOperand = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('number')) {
            inputNumber(button.textContent);
            updateDisplay();
        }

        if (button.classList.contains('decimal')) {
            inputDecimal();
            updateDisplay();
        }

        if (button.classList.contains('operator')) {
            inputOperator(button.textContent);
        }

        if (button.classList.contains('clear')) {
            clearAll();
            updateDisplay();
        }

        if (button.classList.contains('backspace')) {
            backspace();
            updateDisplay();
        }

        if (button.classList.contains('equals')) {
            displayValue = calculate(displayValue);
            updateDisplay();
        }
        if (button.classList.contains('parenthesis')) {
            displayValue = inputParenthesis(button.textContent);
            updateDisplay();
        }
    });
});

function inputParenthesis(parenthesis) {
    if (waitingForSecondOperand) {
        displayValue = parenthesis;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? parenthesis : displayValue + parenthesis;
    }
    return displayValue;
}

function inputNumber(number) {
    if (waitingForSecondOperand) {
        displayValue = number;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? number : displayValue + number;
    }
}

function inputDecimal() {
    if (waitingForSecondOperand) {
        displayValue = '0.';
        waitingForSecondOperand = false;
        return;
    }

    if (!displayValue.includes('.')) {
        displayValue += '.';
    }
}

function inputOperator(nextOperator) {
    displayValue += nextOperator;
    updateDisplay();
}

function clearAll() {
    displayValue = '0';
    operator = '';
    firstOperand = '';
    waitingForSecondOperand = false;
}

function backspace() {
    displayValue = displayValue.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    const display = document.querySelector('.display');
    display.textContent = displayValue;
}


    