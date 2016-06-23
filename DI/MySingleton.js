'use strict'
var mySingleton = (function () {

  // Instance stores a reference to the Singleton
  var instance;
	function Node(name,dependencies)
        {
            this.name=name,
            this.dependency = dependencies
        }
  function init() {
	function CreateLoadSequence()
	{
		var fs = require('fs'); 
		var contents = fs.readFileSync('Data.txt', 'utf8');
		var arrayOfStrings=contents.replace('\r', '').split('\n');
		var allNodes=[];
		for(var i=0;i<arrayOfStrings.length;i++)
		{
			if(arrayOfStrings[i].length > 0)
			{
				var node=CreateNode(arrayOfStrings[i]);
				if(node.name!=="")
				{
					allNodes.push(node);
				}
			}
		}
	return allNodes;
	}
	function CreateNode(inputString)
	{
		var arrayOfLibraries=inputString.split(/:|,/);
		var name="";
		var dependencies=[];
		if(arrayOfLibraries.length>0)
		{
			name=arrayOfLibraries[0].trim();
			for(var i=1;i<arrayOfLibraries.length;i++)
			{
				var dependency=arrayOfLibraries[i].trim();
				if(dependency.length>0)
				{
					dependencies.push(dependency);
				}
				
			}
		}
		return new Node(name,dependencies);
	}	
	function CreateSequence(loadSequence)
	{
		var sequence=[];
		function getObjectIdByName(loadSequence,name)
		{
			var id=-1;
            for(var i=0;i<loadSequence.length;i++)
            {
                if(loadSequence[i].name===name)
                {
                    id = i;
                    break;
                }
            }
            return id;
		}
		function ReduceDependencies(sequence,name)
        {
            for(var i=0;i<sequence.length;i++)
            {
                for(var j=0;j<sequence[i].dependency.length;j++)
                {
                    if(sequence[i].dependency[j]===name)
                    {
                        sequence[i].dependency.splice(j, 1);
                        
                    }
                }
            }
            return sequence;
        }
		function WriteSequence(successSequence,errorSequence)
		{
			var error = "error: ";
			var success = "build plan: ";
			function CreateLineFromArray(line,sequence)
			{
				for(var i=0;i<sequence.length;i++)
				{
					line+=sequence[i]+",";
				}
				return line[line.length-1]==="," ? line.substring(0,line.length-1):line;
			}
			function CreateLineFromArrayOfObjects(line,sequence)
			{
				for(var i=0;i<sequence.length;i++)
				{
					line+=sequence[i].name+",";
				}
				return line[line.length-1]==="," ? line.substring(0,line.length-1):line;
			}
			function RewriteFile(filePath,data)
			{
				var fs = require('fs');
				fs.writeFile(filePath, data, 'utf8', function (err)
				{
					if (err) return console.log(err);
				});
			}
			error=CreateLineFromArrayOfObjects(error,errorSequence);
			success=CreateLineFromArray(success,successSequence);
			RewriteFile("Error.txt",error);
			RewriteFile("Success.txt",success);
			return {
				error:error,
				success:success
			}
			
		}
		while (loadSequence.length > 0) {
			var isClosed=true;
                for (var i = 0; i < loadSequence.length; i++) {
                    if (loadSequence[i].dependency.length === 0) {
                        sequence.push(loadSequence[i].name);
                        var num = getObjectIdByName(loadSequence,loadSequence[i].name);
                        var name = loadSequence[i].name;
                        if (num !== -1) {
                            loadSequence.splice(num, 1);
                            loadSequence = ReduceDependencies(loadSequence, name);
                            i--;
                            
                        }
						isClosed=false;
                    }
                }
				if(isClosed)
				{
					break;
				}
				
            }
			return WriteSequence(sequence,loadSequence);
			
	}
	var allNodes=CreateLoadSequence();	
	return CreateSequence(allNodes);

  };

  return {

    getInstance: function () {

      if ( !instance ) {
        instance = init();
      }

      return instance;
    }

  };

})();

var a=mySingleton.getInstance();
console.log("error: "+a.error);
console.log("success: "+a.success);