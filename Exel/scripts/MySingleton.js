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

		
	function CreateSequence(inputArray)
	{
		var loadSequence=inputArray;
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
			var error = [];
			var success = [];
			function CreateLineFromArray(array,sequence)
			{
				for(var i=0;i<sequence.length;i++)
				{
					array.push(sequence[i]);
				}
				return array;
			}
			function CreateLineFromArrayOfObjects(array,sequence)
			{
				for(var i=0;i<sequence.length;i++)
				{
					array.push(sequence[i].name);
				}
				return array;
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
			// RewriteFile("Error.txt",error);
			// RewriteFile("Success.txt",success);
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
		
	
	return {
		CreateSequence:function(allNodes){
			// var allNodes=CreateLoadSequence();
			return CreateSequence(allNodes);
		}
	}

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

// var instance = mySingleton.getInstance();
// var sequence = instance.CreateSequence();
// console.log("error: "+sequence.error);
// console.log("success: "+sequence.success);