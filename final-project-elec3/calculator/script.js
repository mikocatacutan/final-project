/**
 * Pro Calculator - Advanced Expression Engine
 * Features: Safe RPN evaluation, keyboard support, expression history
 */

class Calculator {
    constructor(displayElement, historyElement) {
        this.display = displayElement;
        this.history = historyElement;
        this.expression = '';
        this.previousResult = null;
    }

    /**
     * Append a number or decimal to the expression
     */
    appendNumber(char) {
        if (char === '.') {
            const lastNumber = this.#getLastNumber();
            if (lastNumber.includes('.')) return;
        }
        this.expression += char;
        this.render();
    }

    /**
     * Append an operator to the expression with validation
     */
    appendOperator(op) {
        if (!this.expression && op !== '-') return;

        const lastChar = this.expression.at(-1);

        if (!this.expression && op === '-') {
            this.expression = '-';
            return this.render();
        }

        if (this.#isOperator(lastChar)) {
            if (op === '-' && lastChar !== '-') {
                this.expression += op;
            }
            return this.render();
        }

        this.expression += op;
        this.render();
    }

    /**
     * Delete the last character
     */
    deleteLast() {
        this.expression = this.expression.slice(0, -1);
        this.render();
    }

    /**
     * Clear the entire expression
     */
    clear() {
        this.expression = '';
        this.previousResult = null;
        this.render();
    }

    /**
     * Evaluate the expression and update display
     */
    calculate() {
        if (!this.expression) return;

        try {
            const value = this.#evaluateExpression(this.expression);
            if (!Number.isFinite(value)) {
                this.display.value = 'Error';
                this.expression = '';
            } else {
                this.previousResult = value;
                this.expression = value.toString();
            }
        } catch (err) {
            this.display.value = 'Error';
            this.expression = '';
        }

        this.render();
    }

    /**
     * Update the display and history
     */
    render() {
        this.display.value = this.expression || '0';
        this.history.textContent = this.expression || this.previousResult || '0';
    }

    /**
     * Get the last number in the expression
     */
    #getLastNumber() {
        const parts = this.expression.split(/([+\-*/])/);
        return parts.length ? parts[parts.length - 1] : '';
    }

    /**
     * Check if a character is an operator
     */
    #isOperator(char) {
        return ['+', '-', '*', '/'].includes(char);
    }

    /**
     * Evaluate the expression safely using RPN
     */
    #evaluateExpression(raw) {
        const tokens = this.#tokenize(raw);
        const rpn = this.#toRpn(tokens);
        return this.#solveRpn(rpn);
    }

    /**
     * Convert expression string to tokens
     */
    #tokenize(expr) {
        const tokens = [];
        let current = '';
        let expectNumber = true;

        for (const char of expr) {
            if (/[0-9.]/.test(char)) {
                current += char;
                expectNumber = false;
                continue;
            }

            if (this.#isOperator(char)) {
                if (char === '-' && expectNumber) {
                    current = '-';
                    expectNumber = false;
                    continue;
                }

                if (!current) throw new Error('Invalid expression');
                tokens.push(parseFloat(current));
                tokens.push(char);
                current = '';
                expectNumber = true;
            }
        }

        if (current) tokens.push(parseFloat(current));
        return tokens;
    }

    /**
     * Convert infix tokens to Reverse Polish Notation (RPN)
     */
    #toRpn(tokens) {
        const output = [];
        const ops = [];
        const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

        for (const token of tokens) {
            if (typeof token === 'number') {
                output.push(token);
            } else {
                while (ops.length && precedence[ops.at(-1)] >= precedence[token]) {
                    output.push(ops.pop());
                }
                ops.push(token);
            }
        }

        return output.concat(ops.reverse());
    }

    /**
     * Solve RPN expression
     */
    #solveRpn(rpn) {
        const stack = [];

        for (const token of rpn) {
            if (typeof token === 'number') {
                stack.push(token);
                continue;
            }

            const b = stack.pop();
            const a = stack.pop();
            if (a === undefined || b === undefined) throw new Error('Invalid expression');

            switch (token) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    stack.push(b === 0 ? NaN : a / b);
                    break;
                default:
                    throw new Error('Unknown operator');
            }
        }

        if (stack.length !== 1 || Number.isNaN(stack[0])) throw new Error('Invalid expression');
        return stack[0];
    }
}

// Initialize calculator
const displayEl = document.getElementById('display');
const historyEl = document.getElementById('history');
const calculator = new Calculator(displayEl, historyEl);

/**
 * Handle input from buttons
 */
function handleInput(key) {
    if (/^[0-9]$/.test(key) || key === '.') {
        calculator.appendNumber(key);
        return;
    }

    if (['+', '-', '*', '/'].includes(key)) {
        calculator.appendOperator(key);
        return;
    }

    if (key === 'delete') {
        calculator.deleteLast();
        return;
    }

    if (key === 'clear') {
        calculator.clear();
        return;
    }

    if (key === 'equals') {
        calculator.calculate();
    }
}

// Bind button clicks
document.querySelectorAll('[data-key]').forEach((button) => {
    button.addEventListener('click', () => handleInput(button.dataset.key));
});

// Keyboard shortcuts
const keyMap = {
    Enter: 'equals',
    '=': 'equals',
    Backspace: 'delete',
    Delete: 'clear',
    Escape: 'clear'
};

document.addEventListener('keydown', (event) => {
    const { key } = event;

    if (/^[0-9]$/.test(key) || key === '.') {
        event.preventDefault();
        return handleInput(key);
    }

    if (['+', '-', '*', '/'].includes(key)) {
        event.preventDefault();
        return handleInput(key);
    }

    if (keyMap[key]) {
        event.preventDefault();
        handleInput(keyMap[key]);
    }
});
