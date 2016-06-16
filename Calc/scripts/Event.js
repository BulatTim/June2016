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
        if (e.key == "Backspace" || e.key == "Delete" || e.key == "Enter")
        {
            var button = document.getElementsByName(e.key);
            button[0].click();
        }
 
    });
   var tempLastValue = "";
    function handler(e) {
        event.preventDefault();
        var window = document.getElementById("inputWindow");
        var text = window.textContent;
        switch (e.target.name) {
            case "Backspace":
                window.textContent = text.substring(0, text.length - 1);
                tempLastValue = tempLastValue.substring(0, tempLastValue.length - 1);
                break;
            case "Delete":
                window.textContent = tempLastValue = "";
                break;
            case "+-":
                var length = tempLastValue.length;
                tempLastValue = ReverseSignLastDigit(tempLastValue);
                window.textContent = window.textContent.substring(0, window.textContent.length - length) + tempLastValue;
                break;
            case "Enter":
                alert("Form will be send to the server");
                break;
            case "0": case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9":
                window.textContent = text += e.target.name;
                tempLastValue += e.target.name;
                break;
            default://all other symbols "*/ ...."
                window.textContent = text += e.target.name;
                tempLastValue = "";
                break;
        }
    }
    function ReverseSignLastDigit(inputString) {
            if (inputString[0] == "-") {
                return inputString.substring(1);
            }
            else if (inputString[0] == "+") {
                return "-" + inputString.substring(1);
            }
            else {
                return "-" + inputString;
            }
    }
});

       
    


