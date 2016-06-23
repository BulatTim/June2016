'use strict'
document.addEventListener("DOMContentLoaded", function () {
    var buttons = document.getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", handler);
    }
    document.addEventListener("keypress", function (e) {
        e.preventDefault();
        var button = document.getElementsByName(e.key);
        button[0].click();

    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" || e.key === "Delete" || e.key === "Enter") {
            var button = document.getElementsByName(e.key);
            button[0].click();
        }

    });
    var tempLastValue = "";
    var stringForCalculate = "";
    function handler(e) {
        event.preventDefault();
        var window = document.getElementById("inputWindow");
        var text = window.textContent;
		if(text == "Ошибка в введенной строке")
		{
			text=window.textContent = tempLastValue = stringForCalculate = "";
		}
		switch (true) {
            case e.target.name === "Backspace":
                window.textContent = text.substring(0, text.length - 1);
                tempLastValue = tempLastValue.substring(0, tempLastValue.length - 1);
                stringForCalculate = stringForCalculate.substring(0, stringForCalculate.length - 1);
                break;
            case e.target.name === "Delete":
                window.textContent = tempLastValue = stringForCalculate = "";
                break;
            case e.target.name === "+-":
                var length = tempLastValue.length;
                tempLastValue = ReverseSignLastDigit(tempLastValue);
                window.textContent = window.textContent.substring(0, window.textContent.length - length) + tempLastValue;                
                stringForCalculate = stringForCalculate.substring(0, stringForCalculate.length - length) + (tempLastValue[0] == "-" ? "u" + tempLastValue.substring(1):tempLastValue);
                break;
            case e.target.name === "Enter":
			    var result=CalculateRPN(ToRPN(stringForCalculate));
				if(isNaN(result))
				{
					window.textContent="Ошибка в введенной строке";
				}
				else
				{
					window.textContent = stringForCalculate = CalculateRPN(ToRPN(stringForCalculate));
				}                
                break;
            case !isNaN(parseInt(e.target.name)):
				 if(!ValidateInput(text,e.target.name))
					 return;
                window.textContent = text += e.target.name;
                stringForCalculate += e.target.name;
                tempLastValue += e.target.name;
                break;
            default: //all other symbols "*/ ...."
				 if(!ValidateInput(text,e.target.name))
					return;
                if (e.target.name === "-" && stringForCalculate === "")
                {
                    stringForCalculate += "u";
					tempLastValue += "-";
                }
				else if(IsUnarySign(e.target.name,stringForCalculate[stringForCalculate.length-1]))
				{
					stringForCalculate += "u";
					tempLastValue += "-";
				}
                else
                {                    
                    stringForCalculate += e.target.name;
                    tempLastValue = "";
                }
				window.textContent = text += e.target.name;                
                break;
        }
    }
	function IsUnarySign(key,lastSign)
	{
		if(key === "-")
		{
			if(lastSign === "+" || lastSign === "-" || lastSign === "*" || lastSign === "/" ||lastSign === "^")
			{
				return true;
			}
		}
		return false;
		
	}
    function ReverseSignLastDigit(inputString) {
        if (inputString === "")
        {
            return "";
        }
        if (inputString[0] === "-") {
            return inputString.substring(1);
        }        
        else {
            return "-" + inputString;
        }
    }
	function ValidateInput(inputString,key)
	{
		var lastOperator = inputString[inputString.length-1];		
		if(IsDoubleOperator(inputString,key))
			return false;
		else if(inputString === ""  && lastOperator !== "-")
			return true;	
		else if(lastOperator === "-" && (isNaN(parseInt(key)) && key !== "("))
			return false;
		else if(key==".")
		{
			var dotCount=GetBracketAndDotCount(GetLastDigit(inputString))
			if(dotCount.dotCount >= 1)
				return false;
		}
		else if(key==")")
		{
			var bracketCount = GetBracketAndDotCount(inputString);
			if(bracketCount.bracketCount !== bracketCount.reversebracketCount+1)
				return false;
		}		
		return true;
		
	}
	function IsDoubleOperator(inputString,key)
	{
		
		var lastOperator=inputString[inputString.length-1];	
		if(inputString === "" || lastOperator === "(" || lastOperator === "+" || lastOperator === "*" 
		|| lastOperator === "/" || lastOperator === "^"  || lastOperator === ".")
		{
			if(key === "+" ||key === "*" ||key === "/" ||key === "^" ||key === ")" ||key === ".")
			{
				return true;
			}
		}
		return false;
	}
	function GetLastDigit(inputString)
	{
		var lastDigit = "";
		for(var i=inputString.length-1;i>=0;i--)
		{
			if(!isNaN(parseInt(inputString[i])) || inputString[i] === ".")
			{
				lastDigit += inputString[i];
			}
			else
			{
				break;
			}
		}
		return lastDigit.split("").reverse().join("");
	}
	function GetBracketAndDotCount(inputString)
	{
		var dotCount=0;
		var bracketCount=0;
		var reversebracketCount=0;
		for(var i=0;i<inputString.length;i++)
		{
			switch(inputString[i])
			{
				case "(":
				bracketCount++;
				break;
				case ")":
				reversebracketCount++;
				break;
				case ".":
				dotCount++;
				break;
			}
			
		}
		return {
			dotCount:dotCount,
			bracketCount:bracketCount,
			reversebracketCount:reversebracketCount
			}
	}
});





