var formatRootUrl = "https://badaro.github.io/validator/";
var format2015ModernSource = "formats/2015modern.json";
var formatPreFireSource  = "formats/prefiremodern.json";
var formatData = {};

var transformSource = "https://api.scryfall.com/cards/search?order=cmc&q=%28is%3Aflip+or+is%3Adfc+or+is%3Aadventure%29+-is%3Aextra+-is%3Adigital+is%3Afirstprint";
var transform = null;

function isValidLine(line)
{
	if(line.length==0) return false;
	if(line.match(/^#/gm)) return false;
	return true;
}

function clearLine(line)
{
	line = line.replace(/^\d+\s/gm, ""); // Removes "2 "
	line = line.replace(/^\d+x\s/gm, ""); // Removes "2x "
	line = line.replace(/\(.*\)/gm, "");  // Removes "(SET")"
	line = line.replace(/\*\w+\*/gm, "");  // Removes "*F*"
	line = line.replace(/^\s+/gm, "");  // Trims leading space
	line = line.replace(/\s+$/gm, "");  // Trims trailing space
	return line;
}

function loadFormatData(name, callback)
{
	console.log("LoadFormatData called");
	
	var url = formatRootUrl + format2015ModernSource;
	if(name=="prefiremodern") url = formatRootUrl + formatPreFireSource;

	if(formatData.hasOwnProperty(name))
	{
		callback();
	}		
	else
	{
		$.get(url, null, function(data)
		{
			formatData[name]=data;
			callback();
		});
	}
}

function loadTransform(url, hasMore, callback)
{
	console.log("LoadTransform called");
	
	if(transform!=null&& !hasMore)
	{
		callback();
	}		
	else
	{	$.get(url, null, function(data)
		{
			if(transform==null) transform = {};
			
			for(var i=0;i<data.data.length;i++)
			{
				transform[data.data[i].card_faces[0].name] = data.data[i].name;
			}
			
			if(data.has_more)
			{
				loadTransform(data.next_page, true, callback);
			}
			else
			{
				transformLoaded = true;
				callback();
			}
		});
	}
}

function validate()
{
	$("#output").val("Loading...");
	
	loadFormatData($("#format").val(), function()
	{
		loadTransform(transformSource, false, validateCards);
	});
}

function validateCards()
{
	console.log("ValidateCards called");
	
	var input = $("#input").val();
	var output = [];
	var lines = input.match(/[^\r\n]+/g);
	var validLines = [];

    if(lines==null)
    {
		$("#output").val("Card list is empty");
 		return;	
	}

	for(var i=0;i<lines.length;i++)
	{
		if(isValidLine(lines[i]))
		{
			var line = clearLine(lines[i]);
			validLines.push(line);
			if(transform.hasOwnProperty(line)) validLines[i] = transform[line];
		}			
	}
	
	for(var i=0;i<validLines.length;i++)
	{
		output.push(validLines[i]);
	}
	
	var output = Array.from(new Set(output)); // Filter unique items
	
	if(output.length==0)
	{
		$("#output").val("No errors found card list");
	}
	else
	{
		$("#output").val(output.join("\n"));
	}
}
