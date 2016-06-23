'use strict'
	   function ToRPN(inputString) {
            var stack = [];
            var outputString = [];
            for (var i = 0; i < inputString.length; i++) {
                switch (!isNaN(parseInt(inputString[i]))) {
                    case true:
                        var operator = GetDigitFromInputString(inputString, i);
                        outputString.push(operator.digit);
                        i = operator.i;
                        break;
                    case false:
                        var operand = GetOperatorFromInputString(inputString[i], stack, outputString);						
                        stack = operand.stack;
                        outputString = operand.outputString;
                        break;
                }
            }
            return outputString.concat(stack.reverse());
        }
function CalculateRPN(rpnString) {
    var stack = [];
    for (var i = 0; i < rpnString.length; i++) {
        var symbol = parseFloat(rpnString[i]);
        if (!isNaN(symbol)) {
            stack.push(symbol);
        }
        else {
            stack = ExecuteOperator(rpnString[i], stack);
        }
    }
    return stack.pop();
}
function GetDigitFromInputString(inputString,i)
{
    var digit = "";
    digit += inputString[i];
    if (!isNaN(parseInt(inputString[i + 1])) || inputString[i + 1] === ".") {
        i++;
        while (!isNaN(parseInt(inputString[i])) || inputString[i] === ".") {
            digit += inputString[i];
            i++;
        }
    }
    return {
        digit: digit,
        i: (digit.length > 1 ? i-1 : i)
    };
}
function GetOperatorFromInputString(inputOperator, stack, outputString) {
    switch (inputOperator) {
                
        case "(":
            stack.push(inputOperator);
            break;
        case "*":case "/":case "+" :case "-":case "u":
            if (stack.length === 0) {
                stack.push(inputOperator);
            }                        
            else if (GetPriority(stack[stack.length - 1]) >= GetPriority(inputOperator)) {
                outputString.push(stack.pop());
                if (stack.length > 0) {
                    while (GetPriority(stack[stack.length - 1]) >= GetPriority(inputOperator)) {
                        outputString.push(stack.pop());
                    }
                }
                stack.push(inputOperator);
            }
            else {
                stack.push(inputOperator);
            }
            break;
        case "^":
            while (GetPriority(stack[stack.length - 1]) > GetPriority(inputOperator)) {
                outputString.push(stack.pop());
            }
            stack.push(inputOperator);
            break;
        case ")":
			
            while (stack[stack.length - 1] != "(") {
                outputString.push(stack.pop());
            }
            stack.pop();			
            break;
    }
    return {
        stack: stack,
        outputString: outputString
    };
}
function GetPriority(operator) {
    if (operator === "(" || operator === ")")
        return 0;
    else if (operator === "+" || operator === "-")
        return 1;
    else if (operator === "*" || operator === "/")
        return 2;
    else
        return 3;
}
function ExecuteOperator(operator,stack) {
    var firstOperand = stack.pop();
    var secondOperand = stack.pop();
    switch (operator) {
        case "u":
            stack.push(secondOperand);
            stack.push(-firstOperand);
            break;
        case "+":                    
            stack.push(secondOperand + firstOperand);              
                
            break;
        case "-":
            stack.push(secondOperand - firstOperand);
            break;
        case "*":
            stack.push(secondOperand * firstOperand);
            break;
        case "/":
            stack.push(secondOperand / firstOperand);
            break;
        case "^":
            stack.push(Math.pow(secondOperand, firstOperand));
            break;
    }
    return stack;
}

        
console.log(CalculateRPN(ToRPN("3 +u2")));
console.log(CalculateRPN(ToRPN("4+3 +u2")));
console.log(CalculateRPN(ToRPN("4+3 -u2")));        
console.log(CalculateRPN(ToRPN("3 -u2")));
console.log(CalculateRPN(ToRPN("3 *u2")));
console.log("3 + 2=" + CalculateRPN(ToRPN("3 + 2")) + " is result identical? " + ((3 + 2) == CalculateRPN(ToRPN("3 + 2"))));
console.log("3 - 2=" + CalculateRPN(ToRPN("3 - 2")) + " is result identical? " + ((3 - 2) == CalculateRPN(ToRPN("3 - 2"))));
console.log("3 * 2=" + CalculateRPN(ToRPN("3 * 2")) + " is result identical? " + ((3 * 2) == CalculateRPN(ToRPN("3 * 2"))));
console.log("3 / 2=" + CalculateRPN(ToRPN("3 / 2")) + " is result identical? " + ((3 / 2) == CalculateRPN(ToRPN("3 / 2"))));
console.log("u3 + 2=" + CalculateRPN(ToRPN("u3 + 2")) + " is result identical? " + ((-3 + 2) == CalculateRPN(ToRPN("u3 + 2"))));
console.log("3 ^ 2=" + CalculateRPN(ToRPN("3 ^ 2")) + " is result identical? " + (Math.pow(3, 2) == CalculateRPN(ToRPN("3 ^ 2"))));
console.log("423 + 134=" + CalculateRPN(ToRPN("423 + 134")) + " is result identical? " + ((423 + 134) == CalculateRPN(ToRPN("423 + 134"))));
console.log("1.33 + 24.2=" + CalculateRPN(ToRPN("1.33 + 24.2")) + " is result identical? " + ((1.33 + 24.2) == CalculateRPN(ToRPN("1.33 + 24.2"))));
console.log("( 8 + 2 * 5 ) / ( 1 + 3 * 2 - 4 )=" + CalculateRPN(ToRPN("( 8 + 2 * 5 ) / ( 1 + 3 * 2 - 4 )")) + " is result identical? " + (((8 + 2 * 5) / (1 + 3 * 2 - 4)) == CalculateRPN(ToRPN("( 8 + 2 * 5 ) / ( 1 + 3 * 2 - 4 )"))));
console.log("2*(3+5)-(6+7)/(8-9)=" + CalculateRPN(ToRPN("2*(3+5)-(6+7)/(8-9)")) + " is result identical? " + ((2 * (3 + 5) - (6 + 7) / (8 - 9)) == CalculateRPN(ToRPN("2*(3+5)-(6+7)/(8-9)"))));
console.log("3 + 4 * 2 / (1 - 5)^2=" + CalculateRPN(ToRPN("3 + 4 * 2 / (1 - 5)^2")) + " is result identical? " + ((3 + 4 * 2 / Math.pow((1 - 5), 2)) == CalculateRPN(ToRPN("3 + 4 * 2 / (1 - 5)^2"))));
console.log("3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3=" + CalculateRPN(ToRPN("3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3")) + " is result identical? " + ((3 + 4 * 2 / Math.pow((1-5), Math.pow(2,3))) == CalculateRPN(ToRPN("3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3"))));

