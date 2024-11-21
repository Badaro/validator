$(document).ready(function()
{
	console.log("document.ready called");

	$("#validate").click(function()
	{
		console.log("#validate.click called");

		var format = null;
		for(var i=0;i<config.formats.length;i++)
		{
			if(config.formats[i].key==$('#format').val()) format = config.formats[i];
		}

		validator.validate(config.rootUrl + format.datafile, format.key, $("#input").val(), function(output)
		{
			if(output.length==0)
			{
				$("#output").val("Card list is empty");
			}
			else
			{
				var errorMessages = [];
				for(var i=0;i<output.length;i++)
				{
					if(output[i].error) errorMessages.push(output[i].message);
				}

				if(errorMessages.length==0)
				{
					$("#output").val("No errors found in this card list");
				}
				else
				{
					$("#output").val(errorMessages.join("\n"));
				}
			}
		});
	});

	for(var i=0;i<config.formats.length;i++)
	{
		$("#format").append($("<option>", {
			value: config.formats[i].key,
			text: config.formats[i].name
		}));
	}

	transform.setUrl(config.transformUrl);
});
