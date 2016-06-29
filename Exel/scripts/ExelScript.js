 
document.addEventListener("DOMContentLoaded", function () {
    var cells = document.getElementsByTagName("td");
    var currentCell;
	var choseCell;
	var allNodes = [];
	var allFormulas = [];
	var sequence = "";
    var inputWindow = document.getElementById("inputWindow");
	var arrayAfterCalculate;
	
	(function SetName(cells)
	{
		var names = [];
		var letters = "ABCDEFGHIJ";
		for(var j = 1;j <= 10;j++)
		{
			for(var i = 0;i < letters.length;i++)
			{
				names.push(letters[i] + j);
			}
				
		}
		
		for(var i = 0;i < cells.length;i++)
		{
			
			cells[i].setAttribute("id",names[i]);
		}
	})(cells);	
	
    inputWindow.addEventListener("keypress", function (e) {
		inputWindow.focus();
		if(currentCell === undefined)
		{
			alert("Выберите ячейку");
			e.preventDefault();
			return;			
		}		
		else if(!IsSymbolForCalculate(e))
		{
			e.preventDefault();
			return;
		}
        currentCell.textContent += e.key;
    });
	
	inputWindow.addEventListener("keydown", function (e) {
		switch(true)
		{
			case e.key === "Backspace":
				if(inputWindow.value[0] === "=")
				{
					DeleteFormula();
				}
				else
				{
					var text=currentCell.textContent;
					currentCell.textContent=text.substring(0,text.length-1);
				}
				break;
			case e.key === "=" && currentCell !== undefined:
				ToggleEvents("click",[ClickOnCellHandler],[WriteFormulaHandler,AddCellInFormulaHandler]);
				break;
			case e.key === "Enter" && inputWindow.value[0] === "=":
				AddFormula();
				break;
			case e.key === "Enter" && inputWindow.value[0] !== "=":
				if(sequence !== "")
				{
					arrayAfterCalculate = Calculate(sequence);
					InsertValues(arrayAfterCalculate);					
				}				
				inputWindow.value = "";							
				break;
		}
	});
	
	function ToggleEvents(evnt,eventsForDelete,eventForAdd)
	{
		for(var i = 0; i < cells.length; i++)
		{
			for(var j = 0;j < eventsForDelete.length;j++)
			{
				cells[i].removeEventListener(evnt, eventsForDelete[j],false);
			}
			for(var j = 0;j < eventForAdd.length;j++)
			{
				cells[i].addEventListener(evnt,eventForAdd[j],false);
			}
		}
	}
	
	for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", ClickOnCellHandler);
    }
	function Node(name,dependencies)
    {
        this.name=name,
        this.dependency = dependencies
    }
	
	function Formula(cellName,formula)
	{
		this.name=cellName;
		this.formula=formula;
	}
	
	function DeleteFormula()
	{
		inputWindow.value = currentCell.textContent = "";
				if(sequence !== "" && sequence.error !== "")
				{
					for(var i = 0;i < sequence.error.length;i++)
					{
						var elem = document.getElementById(sequence.error[i]);
						elem.removeAttribute("class","redCell");
					}
				}				
				choseCell.removeAttribute("class","blueCell");
				var formulaId = getObjectIdByName(allFormulas,currentCell.id);
				allFormulas.splice(formulaId,1);
				var nodeId = getObjectIdByName(allNodes,currentCell.id);
				allNodes.splice(nodeId,1);				
				ExtendNodeSequence();
				sequence =  mySingleton.getInstance().CreateSequence(JSON.parse(JSON.stringify(allNodes)));
	}
	
	
	function AddFormula()
	{
		var formulaAndNode = CreateFormulaAndNode();			
			AddNodeInArray(formulaAndNode.node,formulaAndNode.formula);			
			
			sequence = mySingleton.getInstance().CreateSequence(JSON.parse(JSON.stringify(allNodes)));
			var arrayAfterCalculate = Calculate(sequence);
			InsertValues(arrayAfterCalculate);
			
			inputWindow.value = "";
			if (currentCell !== undefined) {
                currentCell.classList.remove("greenCell");
            }
			if (choseCell !== undefined) {
                choseCell.classList.remove("blueCell");
            }
			ToggleEvents("click",[WriteFormulaHandler,AddCellInFormulaHandler],[ClickOnCellHandler]);
			
	}
	function InsertValues(valueArray)
	{
		for(var i=0;i<valueArray.length;i++)
		{
			var cell = document.getElementById(valueArray[i].name);
			cell.textContent=valueArray[i].formula;
			
		}
	}
	
	function Calculate(sequence)
	{
		var valueArray = [];
		if(sequence.error.length > 0)
		{
			for(var i = 0;i < sequence.error.length;i++)
			{
				var elem = document.getElementById(sequence.error[i]);
				elem.classList.add("redCell");
			}
			alert("Ошибка! Имеются ячейки, имеющие циклические зависимости. Эти ячейки выделены красным цветом");
		}		 
		for(var i = 0;i < sequence.success.length;i++)
		{
			var id = getObjectIdByName(allFormulas,sequence.success[i]);
			
			if(id === -1)
			{
				var name = sequence.success[i];
				valueArray.push(new Formula(name,document.getElementById(name).textContent));
			}
			else
			{
				valueArray.push(CastFormula(allFormulas[id]));
			}
		}
		
		function CastFormula(formula)
		{
			function FindValue(name)
			{
				var valueId = getObjectIdByName(valueArray,name);
				return valueArray[valueId].formula;
			}
			var slittedFormula = SplitFormula(formula.formula);
			for(var i = 0;i < slittedFormula.length;i++)
			{
				if(slittedFormula[i].length > 1 && isNaN(parseFloat(slittedFormula[i])))
				{
					slittedFormula[i] = FindValue(slittedFormula[i]);
				}
			}
			return new Formula(formula.name,CalculateRPN(ToRPN(slittedFormula.join(""))));
		}
		function SplitFormula(formula)
		{
			var array = [];
			var token = "";
			for(var i=0;i < formula.length;i++)
			{
				if(!isNaN(parseInt(formula[i])) || (formula.charCodeAt(i) >= 65 && formula.charCodeAt(i) <= 74))
				{
					token += formula[i];
					continue;
				}
				else
				{  
					if(token !== "")
					{
						array.push(token);
					}					
					token = formula[i];
					array.push(token);
					token = "";
				}
			}
			if(token !== "")
					{
						array.push(token);
					}
			return array;
		}
		return valueArray;
	}
	
	function CreateFormulaAndNode()
	{
		var name = currentCell.id;
		var text = inputWindow.value;
		var dependencies = text.match(/[A-J]+10|[A-J]+[0-9]/g);
		var formula = text.substring(1);
		return {
			node:new Node(name,dependencies),
			formula:new Formula(name,formula)
		}
	}
	
	function getObjectIdByName(loadSequence,name)
	{
			var id =- 1;
            for(var i = 0;i < loadSequence.length;i++)
            {
                if(loadSequence[i].name === name)
                {
                    id = i;
                    break;
                }
            }
            return id;
	}
	
	function ExtendNodeSequence()
	{
		var dependencies = [];
		for(var i = 0;i < allNodes.length;i++)
		{
			for(var j = 0;j < allNodes[i].dependency.length;j++)
			{
				if(getObjectIdByName(dependencies,allNodes[i].dependency[j]) === -1)
				{
					dependencies.push(allNodes[i].dependency[j]);
				}
			}
		}
		for(var i = 0;i < dependencies.length;i++)
		{
			if(getObjectIdByName(allNodes,dependencies[i]) === -1)
			{
				allNodes.push(new Node(dependencies[i],[]));
			}
		}
		
	}
	
	function AddNodeInArray(node,formula)
	{		
		var nodeId=getObjectIdByName(allNodes,node.name);
		if(nodeId === -1)
		{
			allNodes.push(node);
			ExtendNodeSequence();		
			
		}
		else
		{
			allNodes.splice(nodeId,1);
			allNodes.push(node);
			ExtendNodeSequence();
		}
		var formulaId = getObjectIdByName(allFormulas,formula.name);
		if(formulaId === -1)
		{
			allFormulas.push(formula)
		}
		else
		{
			allFormulas.splice(formulaId,1);
			allFormulas.push(formula);
		}
	}
	
	function WriteFormulaHandler(e)
	{
		inputWindow.value += e.target.id;
		currentCell.textContent += e.target.id;
		inputWindow.focus();
	}
	
	function ClickOnCellHandler(e)
	{
		inputWindow.value = "";
        if (currentCell !== undefined) {
            currentCell.classList.remove("greenCell");
        }
        currentCell = e.target;
        currentCell.classList.add("greenCell");
		var formulaId = getObjectIdByName(allFormulas,currentCell.id);
		if(formulaId !== -1)
		{
			inputWindow.value = "=" + allFormulas[formulaId].formula;
		}
		else
		{
			inputWindow.value = currentCell.textContent;
		}			
	}
	
	function AddCellInFormulaHandler(e)
	{
		if (choseCell !== undefined) {
                choseCell.classList.remove("blueCell");
            }
            choseCell = e.target;
            choseCell.classList.add("blueCell");
	}
    
	function IsSymbolForCalculate(e)
	{
				
		if(!isNaN(parseInt(e.key)))
		{
			return true;
		}
		else if(e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/" || e.key === "^" || e.key === "(" || e.key === ")" || e.key === "=" )
		{
			return true;
		}
		else if (e.charCode >= 65 && e.charCode <= 74)
		{
			return true;
		}			
		return false;
	}

});
