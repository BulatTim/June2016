		function ToRPN(inputString) {
            var stack = [];
            var outputString = [];
            for (var i = 0; i < inputString.length; i++) {
                if (inputString[i] == " ")
                    continue;
                else if (!isNaN(parseInt(inputString[i]))) {
                    var digit = "";
                    digit += inputString[i];
                    if (!isNaN(parseInt(inputString[i + 1])) || inputString[i+1] == ".")
                    {
                        i++;
                        while(!isNaN(parseInt(inputString[i]))||inputString[i]==".")
                        {
                            digit += inputString[i];
                            i++;
                        }
                    }
                    outputString.push(digit);
                }
                else if (inputString[i] == "*" || inputString[i] == "/" || inputString[i] == "+"
                || inputString[i] == "-" || inputString[i] == "^" || inputString[i] == "(") {
                    if (stack.length == 0 || inputString[i] == "(") {
                        stack.push(inputString[i]);
                    }
                    else if (inputString[i] == "^") {
                        while (GetPriority(stack[stack.length - 1]) > GetPriority(inputString[i])) {
                            outputString.push( stack.pop());
                        }
                        stack.push(inputString[i]);
                    }
                    else if (GetPriority(stack[stack.length - 1]) >= GetPriority(inputString[i])) {
                        outputString.push(stack.pop());
                        if (stack.length > 0) {
                            while (GetPriority(stack[stack.length - 1]) >= GetPriority(inputString[i])) {
                                outputString.push(stack.pop());
                            }
                        }
                        stack.push(inputString[i]);
                    }
                    else {
                        stack.push(inputString[i]);
                    }
                }
                else if (inputString[i] == ")") {
                    while (stack[stack.length - 1] != "(") {
                        outputString.push(stack.pop());
                    }
                    stack.pop();
                }
                else {
                    return "";
                }
            }
            return outputString.concat(stack.reverse());
        }

        function GetPriority(operator) {
            if (operator == "(" || operator == ")")
                return 0;
            else if (operator == "+" || operator == "-")
                return 1;
            else if (operator == "*" || operator == "/")
                return 2;
            else
                return 3;
        }


        function CalculateRPN(rpnString) {
            var stack = [];
            for (var i = 0; i < rpnString.length; i++) {
                var symbol = parseFloat(rpnString[i]);
                if (!isNaN(symbol)) {
                    stack.push(symbol);
                }
                else {
                    var firstOperand = stack.pop();
                    var secondOperand = stack.pop();
                    switch (rpnString[i]) {
                        case "+":
                            stack.push(secondOperand + firstOperand);
                            break;
                        case "-":
                            if (secondOperand == undefined) {
                                stack.push(-firstOperand);
                            }
                            else {
                                stack.push(secondOperand - firstOperand);
                            }
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
                }
            }
            return stack.pop();
        }

        console.log("3 + 2=" + CalculateRPN(ToRPN("3 + 2")) + " is result identical? " + ((3 + 2) == CalculateRPN(ToRPN("3 + 2"))));
        console.log("3 - 2=" + CalculateRPN(ToRPN("3 - 2")) + " is result identical? " + ((3 - 2) == CalculateRPN(ToRPN("3 - 2"))));
        console.log("3 * 2=" + CalculateRPN(ToRPN("3 * 2")) + " is result identical? " + ((3 * 2) == CalculateRPN(ToRPN("3 * 2"))));
        console.log("3 / 2=" + CalculateRPN(ToRPN("3 / 2")) + " is result identical? " + ((3 / 2) == CalculateRPN(ToRPN("3 / 2"))));
        console.log("-3 + 2=" + CalculateRPN(ToRPN("-3 + 2")) + " is result identical? " + ((-3 + 2) == CalculateRPN(ToRPN("-3 + 2"))));
        console.log("3 ^ 2=" + CalculateRPN(ToRPN("3 ^ 2")) + " is result identical? " + (Math.pow(3, 2) == CalculateRPN(ToRPN("3 ^ 2"))));
        console.log("423 + 134=" + CalculateRPN(ToRPN("423 + 134")) + " is result identical? " + ((423 + 134) == CalculateRPN(ToRPN("423 + 134"))));
        console.log("1.33 + 24.2=" + CalculateRPN(ToRPN("1.33 + 24.2")) + " is result identical? " + ((1.33 + 24.2) == CalculateRPN(ToRPN("1.33 + 24.2"))));
        console.log("( 8 + 2 * 5 ) / ( 1 + 3 * 2 - 4 )=" + CalculateRPN(ToRPN("( 8 + 2 * 5 ) / ( 1 + 3 * 2 - 4 )")) + " is result identical? " + (((8 + 2 * 5) / (1 + 3 * 2 - 4)) == CalculateRPN(ToRPN("( 8 + 2 * 5 ) / ( 1 + 3 * 2 - 4 )"))));
        console.log("2*(3+5)-(6+7)/(8-9)=" + CalculateRPN(ToRPN("2*(3+5)-(6+7)/(8-9)")) + " is result identical? " + ((2 * (3 + 5) - (6 + 7) / (8 - 9)) == CalculateRPN(ToRPN("2*(3+5)-(6+7)/(8-9)"))));
        console.log("3 + 4 * 2 / (1 - 5)^2=" + CalculateRPN(ToRPN("3 + 4 * 2 / (1 - 5)^2")) + " is result identical? " + ((3 + 4 * 2 / Math.pow((1 - 5), 2)) == CalculateRPN(ToRPN("3 + 4 * 2 / (1 - 5)^2"))));
        console.log("3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3=" + CalculateRPN(ToRPN("3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3")) + " is result identical? " + ((3 + 4 * 2 / Math.pow((1-5), Math.pow(2,3))) == CalculateRPN(ToRPN("3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3"))));
