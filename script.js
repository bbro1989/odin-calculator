let display = document.querySelector("#operands_text_box");
let calculator = document.querySelector(".calculator_container");


let number1 = null;
let operator = null;
let number2 = null;
let waitingForNewNumber = false;
let resettingDisplay = false;   


let currentInput = "0";

function roundResult(num) {
    if (typeof num !== "number") return num;
    return   Math.round(num * 1000000) / 1000000;  
}


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
    if (b === 0) return "Error";
    return a / b;
}


function operate(op, a, b) {
    if (typeof a !== "number" || typeof b !== "number") return "Error";
    switch (op) {
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "*":
            return multiply(a, b);
        case "/":
            return divide(a, b);
        default:
            return "Invalid operator";
    }
}


function updateDisplay() {
    let value = currentInput.toString();
    if (value.length > 6) {
        value = parseFloat(value).toExponential(3);
    }
    display.value = value;
}


function resetCalculator() {
    currentInput = "0";
    number1 = null;
    operator = null;
    number2 = null;
    waitingForNewNumber = false;
    updateDisplay();
}


function handleNumber(num) {
    if (waitingForNewNumber) {
        currentInput = num;
        waitingForNewNumber = false;
    } else {
        if (currentInput === "0") {
            currentInput = num;
        } else if (currentInput.length < 6) {
            currentInput += num;
        }
    }
    updateDisplay();
}


function handleDecimal() {
    if (waitingForNewNumber) {
        currentInput = "0.";
        waitingForNewNumber = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }
    updateDisplay();
}


function handleOperator(nextOperator) {
    const inputNum = parseFloat(currentInput);

    if (number1 === null) {
        number1 = inputNum;
    } else if (operator && !waitingForNewNumber) {

        number2 = inputNum;
        const result = operate(operator, number1, number2);
        
        if (result === "Error") {
            currentInput = "Error";
            updateDisplay();
            resetCalculator();
            return;
        }

        currentInput = roundResult(result).toString();
        number1 = result;
        updateDisplay();
    }

    waitingForNewNumber = true;
    operator = nextOperator;
}


function handleEqual() {
    if (!operator || waitingForNewNumber) return;

    number2 = parseFloat(currentInput);
    const result = operate(operator, number1, number2);

    if (result === "Error") {
        currentInput = "Error";
        updateDisplay();
        resetCalculator();
        return;
    }

    currentInput = roundResult(result).toString();
    display.value = currentInput;


    number1 = result;
    waitingForNewNumber = true;
    operator = null;
}


calculator.addEventListener("click", (event) => {
    const target = event.target;

    if (!target.classList.contains("number-btn") && 
        !target.classList.contains("calc-btn") && 
        !["equal", "decimal", "reset"].includes(target.id)) {
        return; 
    }

    if (target.id === "reset") {
        resetCalculator();
        return;
    }

    if (currentInput === "Error") {
        resetCalculator();
        return;
    }

    if (target.id === "decimal") {
        handleDecimal();
        return;
    }

    if (target.id === "equal") {
        handleEqual();
        return;
    }

    if (target.classList.contains("number-btn")) {
        handleNumber(target.textContent);
        return;
    }

    if (target.classList.contains("calc-btn")) {
        handleOperator(target.textContent);
    }
});