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
  const precedence = {
    '(': 3,
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };

  const isOperator = (token) => token in precedence;
  const applyOperator = (operator, b, a) => {
    switch (operator) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        if (b === 0) {
          throw new Error("Division by zero");
        }
        return a / b;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  };

  const infixToPostfix = (tokens) => {
    const output = [];
    const operatorStack = [];

    for (const token of tokens) {
      if (!isNaN(token)) {
        output.push(parseFloat(token));
      } else if (isOperator(token)) {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== '(' &&
          precedence[token] <= precedence[operatorStack[operatorStack.length - 1]]
        ) {
          output.push(operatorStack.pop());
        }
        operatorStack.push(token);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
          output.push(operatorStack.pop());
        }
        if (operatorStack.length === 0 || operatorStack[operatorStack.length - 1] !== '(') {
          throw new Error("Mismatched parentheses");
        }
        operatorStack.pop();
      } else {
        throw new Error(`Invalid token: ${token}`);
      }
    }

    while (operatorStack.length > 0) {
      if (operatorStack[operatorStack.length - 1] === '(') {
        throw new Error("Mismatched parentheses");
      }
      output.push(operatorStack.pop());
    }

    return output;
  };

  const tokens = expression.match(/(\d+\.?\d*|-\d+\.?\d*|\+|\-|\*|\/|\(|\))/g);
  const postfixExpression = infixToPostfix(tokens);

  const operandStack = [];
  for (const token of postfixExpression) {
    if (!isNaN(token)) {
      operandStack.push(token);
    } else if (isOperator(token)) {
      const b = operandStack.pop();
      const a = operandStack.pop();
      operandStack.push(applyOperator(token, b, a));
    } else {
      throw new Error(`Invalid token: ${token}`);
    }
  }

  if (operandStack.length !== 1) {
    throw new Error("Invalid expression");
  }

  return operandStack[0];
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
            inputParenthesis(button.textContent);
            updateDisplay()
        }
    });
});

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

function inputParenthesis(parenthesis) {
    displayValue += parenthesis;
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
